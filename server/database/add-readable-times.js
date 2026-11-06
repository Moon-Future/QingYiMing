// 在项目根目录运行本脚本可预览变更，加 --apply 后才会执行 ALTER TABLE。
// 原毫秒时间戳仍是唯一写入来源；虚拟生成列同时覆盖已有记录和以后的新增、修改。
const mysql = require('mysql')
const config = require('./config')

const fields = {
  company: ['createTime', 'updateTime'],
  counter: ['time'],
  delivery: ['ptime', 'time', 'createTime', 'updateTime'],
  delivery_qrcode: ['createTime', 'updateTime'],
  deliverygrp: ['createTime', 'updateTime'],
  inventory: ['createTime', 'updateTime'],
  inventoryin: ['time', 'createTime', 'updateTime'],
  inventoryout: ['sentTime', 'createTime'],
  ord: ['time', 'createTime', 'updateTime'],
  ordgrp: ['createTime', 'updateTime'],
  product: ['createTime', 'updateTime'],
  qrcode_product: ['createTime', 'updateTime'],
  supply: ['createTime', 'updateTime'],
  unit: ['createTime', 'updateTime'],
  user: ['createTime', 'updateTime']
}

async function migrate(connection, apply) {
  const run = (sql, args) => new Promise((resolve, reject) =>
    connection.query(sql, args, (error, rows) => error ? reject(error) : resolve(rows)))
  const columns = await run('SELECT TABLE_NAME t, COLUMN_NAME c, DATA_TYPE typ, DATETIME_PRECISION precisionSeconds, EXTRA extra, COLUMN_COMMENT note FROM information_schema.columns WHERE table_schema=DATABASE()')
  const plan = []
  for (const [table, names] of Object.entries(fields)) {
    const existing = columns.filter(row => row.t === table)
    if (!existing.length) throw new Error('缺少预期的数据表：' + table)
    const additions = []
    for (const name of names) {
      const source = existing.find(row => row.c === name)
      if (!source || source.typ !== 'bigint') throw new Error('请核对时间戳字段：' + table + '.' + name)
      const target = name + 'DateTime'
      const marker = '北京时间 UTC+08:00，来源：' + name
      const previous = existing.find(row => row.c === target)
      if (previous) {
        if (previous.typ !== 'datetime' || Number(previous.precisionSeconds) !== 0 || !previous.extra.includes('VIRTUAL GENERATED') || previous.note !== marker) {
          throw new Error('同名字段需要人工核对：' + table + '.' + target)
        }
        continue
      }
      // 固定北京时间的纪元起点，避免连接时区影响显示。旧库用 0 或 NULL 表示未填写。
      const expression = "CASE WHEN ?? BETWEEN 1 AND 253402271999999 THEN TIMESTAMPADD(SECOND, ?? DIV 1000, CAST('1970-01-01 08:00:00' AS DATETIME)) END"
      additions.push(mysql.format('ADD COLUMN ?? DATETIME GENERATED ALWAYS AS (' + expression + ') VIRTUAL COMMENT ?', [target, name, name, marker]))
    }
    if (additions.length) plan.push('ALTER TABLE ' + mysql.escapeId(table) + ' ' + additions.join(', '))
  }
  for (const sql of plan) {
    console.log(sql)
    if (apply) await run(sql)
  }
  console.log(plan.length + ' 张表' + (apply ? '已处理' : '待处理（预览）'))
}

if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.length && !(args.length === 1 && args[0] === '--apply')) throw new Error('仅支持 --apply 参数')
  const connection = mysql.createConnection(config)
  migrate(connection, args.length === 1).catch(error => {
    console.error(error.message)
    process.exitCode = 1
  }).finally(() => connection.end())
}
module.exports = migrate
