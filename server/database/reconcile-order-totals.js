const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const { spawn } = require('child_process')
const mysql = require('mysql')
const query = require('./init')
const config = require('./config')

async function audit(run) {
  const [groups, orders, deliveries] = await Promise.all([
    run('SELECT id, ord, qtyAll, sentAll, finished, off FROM ordgrp'),
    run('SELECT id, uuid, qty, sentQty, off FROM ord'),
    run("SELECT ordId, qty, off FROM delivery WHERE template IN (3,4)")
  ])
  const lines = new Map()
  const shipped = new Map()
  const invalid = new Set()
  for (const row of orders) {
    if (!lines.has(row.uuid)) lines.set(row.uuid, [])
    if (row.off === 0) lines.get(row.uuid).push(row)
  }
  for (const row of deliveries) {
    if (row.off !== 0) continue
    const quantity = Number(row.qty)
    const key = String(row.ordId)
    if (!Number.isSafeInteger(quantity) || quantity < 0) invalid.add(key)
    else shipped.set(key, (shipped.get(key) || 0) + quantity)
  }
  const safe = [], review = []
  for (const group of groups) {
    if (group.off !== 0) continue
    const active = lines.get(group.ord) || []
    const qty = active.reduce((sum, row) => sum + row.qty, 0)
    const sent = active.reduce((sum, row) => sum + row.sentQty, 0)
    if (group.qtyAll === qty && group.sentAll === sent) continue
    const reasons = []
    if (!active.length) reasons.push('没有有效订单明细')
    if (active.some(row => invalid.has(String(row.id)))) reasons.push('存在无法核算的送货数量')
    if (active.some(row => row.sentQty !== (shipped.get(String(row.id)) || 0))) reasons.push('订单明细与有效送货记录不一致')
    if (sent > qty) reasons.push('明细已送数量超过订购数量')
    const item = { id: group.id, old: {qtyAll:group.qtyAll,sentAll:group.sentAll,finished:group.finished},
      expected: {qtyAll:qty,sentAll:sent,finished:Number(sent === qty)}, reasons }
    ;(reasons.length ? review : safe).push(item)
  }
  return { safe, review }
}

async function backup() {
  const dir = path.join(os.homedir(), '.local/share/qym-order-repair', new Date().toISOString().replace(/[:.]/g, '-'))
  fs.mkdirSync(dir, {recursive:true, mode:0o700})
  const dump = path.join(dir, 'before.sql')
  const command = process.env.QYM_MYSQLDUMP || (fs.existsSync('/usr/local/mysql/bin/mysqldump') ? '/usr/local/mysql/bin/mysqldump' : 'mysqldump')
  const args = ['--single-transaction','--quick','--no-tablespaces','-h',config.host,'-P',String(config.port),'-u',config.user,config.database]
  const hash = crypto.createHash('sha256')
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dump, {mode:0o600})
    const child = spawn(command, args, {env:{...process.env,MYSQL_PWD:config.password}})
    let errors = ''
    child.stdout.on('data', chunk => hash.update(chunk))
    child.stdout.pipe(output)
    child.stderr.on('data', chunk => {errors += chunk.toString()})
    child.on('error', reject)
    output.on('error', reject)
    const finished = new Promise(done => output.on('finish', done))
    child.on('close', code => {
      if (code !== 0) reject(new Error('备份失败: '+errors))
      else finished.then(resolve)
    })
  })
  fs.writeFileSync(path.join(dir,'SHA256'), hash.digest('hex')+'  before.sql\n')
  return dir
}

async function main() {
  const before = await audit(query)
  // 默认只输出差异。显式指定 --apply 才会备份并修复可确定的汇总差异。
  if (process.argv[2] !== '--apply') {
    console.log(JSON.stringify({mode:'audit',...before}, null, 2))
    return
  }
  const dir = await backup()
  fs.writeFileSync(path.join(dir,'audit.json'), JSON.stringify(before,null,2))
  await query.transaction(async run => {
    const locked = await run('SELECT id FROM ordgrp WHERE off=0 FOR UPDATE')
    const rows = await run('SELECT id FROM ord WHERE off=0 FOR UPDATE')
    const checked = await audit(run)
    if (JSON.stringify(checked) !== JSON.stringify(before)) throw new Error('对账期间数据变化，请重新执行审计')
    for (const item of checked.safe) {
      const result = await run('UPDATE ordgrp SET qtyAll=?, sentAll=?, finished=?, updateTime=? WHERE id=? AND qtyAll=? AND sentAll=? AND finished=? AND off=0',
        [item.expected.qtyAll,item.expected.sentAll,item.expected.finished,Date.now(),item.id,item.old.qtyAll,item.old.sentAll,item.old.finished])
      if (result.affectedRows !== 1) throw new Error('订单在修复期间发生变化: '+item.id)
    }
  })
  const after = await audit(query)
  fs.writeFileSync(path.join(dir,'after.json'), JSON.stringify(after,null,2))
  console.log(JSON.stringify({backup:dir, updated:before.safe.length, review:after.review.map(row=>row.id), remaining:after.safe.length}))
}
main().then(()=>process.exit(0)).catch(error=>{console.error(error.message);process.exit(1)})
