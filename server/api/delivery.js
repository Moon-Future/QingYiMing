const Router = require('koa-router')
const uuid = require('uuid/v1')
const query = require('../database/init')
const checkRoot = require('./root')
const router = new Router()

function requireValue(condition, message) {
  if (!condition) throw Object.assign(new Error(message), { business: true })
}

function positiveId(value) {
  const id = Number(value)
  requireValue(Number.isSafeInteger(id) && id > 0, '记录编号无效')
  return id
}

function month(timestamp) {
  const date = new Date(Number(timestamp))
  return date.getFullYear() * 12 + date.getMonth()
}

function endpoint(path, handler) {
  router.post(path, async ctx => {
    const permission = checkRoot(ctx, true)
    if (permission.code !== 200) { ctx.body = permission; return }
    try {
      ctx.body = Object.assign({ code: 200 }, await handler(ctx.request.body.data || {}))
    } catch (error) {
      // 旧前端收到 HTTP 成功状态就会提示保存成功，业务校验失败时也必须返回错误状态。
      ctx.status = error.business ? 409 : 500
      ctx.body = { code: 500, message: error.business ? error.message : '送货操作失败' }
      if (!error.business) ctx.app.emit('error', error, ctx)
    }
  })
}

async function lockCustomer(run, id) {
  const rows = await run('SELECT * FROM company WHERE id = ? FOR UPDATE', [positiveId(id)])
  requireValue(rows.length === 1, '客户不存在')
  return rows[0]
}

async function changeOrder(run, item, delta, groups) {
  const [order] = await run('SELECT * FROM ord WHERE id = ? AND off = 0 FOR UPDATE', [positiveId(item.ordId)])
  requireValue(order && order.cust === Number(item.cust) && order.prd === Number(item.prd), '订单行与客户或产品不匹配')
  // 历史送货量与订单明细对不上时，无法确定哪边正确，继续开单或撤销都会扩大差异。
  const deliveries = await run('SELECT qty FROM delivery WHERE ordId = ? AND template IN (3,4) AND off = 0', [String(order.id)])
  const recordedSent = deliveries.reduce((sum, delivery) => sum + Number(delivery.qty), 0)
  requireValue(deliveries.every(delivery => Number.isSafeInteger(Number(delivery.qty)) && Number(delivery.qty) > 0)
    && recordedSent === order.sentQty, '订单历史送货数量不一致，请先核对')
  const sent = order.sentQty + delta
  requireValue(Number.isSafeInteger(sent) && sent >= 0 && sent <= order.qty, '送货数量超出订单范围')
  if (!groups.has(order.uuid)) {
    const [group] = await run('SELECT * FROM ordgrp WHERE ord = ? AND off = 0 FOR UPDATE', [order.uuid])
    requireValue(group, '订单已删除或不存在')
    const [totals] = await run('SELECT COALESCE(SUM(qty),0) AS qty, COALESCE(SUM(sentQty),0) AS sent FROM ord WHERE uuid = ? AND off = 0', [order.uuid])
    requireValue(group.qtyAll === totals.qty && group.sentAll === totals.sent,
      '订单汇总与明细不一致，请先核对')
    groups.set(order.uuid, group)
  }
  const group = groups.get(order.uuid)
  group.sentAll += delta
  await run('UPDATE ord SET sentQty = ?, finished = ? WHERE id = ?', [sent, Number(sent === order.qty), order.id])
  return { ord: order.ord, ordUuid: order.uuid, ordId: order.id, sentQty: sent }
}

async function updateGroups(run, groups) {
  for (const group of groups.values()) {
    requireValue(group.sentAll >= 0 && group.sentAll <= group.qtyAll, '订单汇总存在差异，请核对后再操作')
    await run('UPDATE ordgrp SET sentAll = ?, finished = ? WHERE id = ?',
      [group.sentAll, Number(group.sentAll === group.qtyAll), group.id])
  }
}

async function stock(run, item, delta, now) {
  await run('UPDATE inventory SET qty = qty - ?, sentQty = COALESCE(sentQty,0) + ?, updateTime = ? WHERE prd = ? AND off = 0',
    [delta, delta, now, positiveId(item.prd)])
}

endpoint('/saveDelivery', data => query.transaction(async run => {
  const items = data.deliveryData
  requireValue(Array.isArray(items) && items.length, '送货单不能为空')
  const customer = await lockCustomer(run, items[0].cust)
  const now = Date.now()
  const [counter] = await run("SELECT * FROM counter WHERE cust = ? AND type = 'delivery' FOR UPDATE", [customer.id])
  requireValue(customer.off === 0 && counter, '请重新选择客户')
  const no = month(counter.time) === month(now) ? counter.number + 1 : 1
  requireValue(data.counter && Number(data.counter.number) === no, '单号已变化，请刷新后重新打印')
  const groups = new Map()
  const id = uuid()
  const rows = []
  for (const item of items) {
    requireValue(item && Number(item.cust) === customer.id && Number(item.template) === customer.template && Number(item.no) === no, '送货单信息不一致')
    const qty = Number(item.qty)
    requireValue(Number.isFinite(qty) && qty > 0, '送货数量必须为正数')
    requireValue(Object.values(item).every(v => v === null || ['string','number','boolean'].includes(typeof v)), '单据字段格式错误')
    const reference = [3,4].includes(customer.template) ? await changeOrder(run, item, qty, groups) : {ord:'',ordUuid:'',ordId:'',sentQty:qty}
    rows.push(Object.assign({}, item, reference))
  }
  await updateGroups(run, groups)
  for (const item of rows) {
    const fields = ['prd','prdm','cust','custm','model','nun','unit','unitm','qty','qtyR','ptime','lot','remark','time','version','address']
    const record = {id, ord:item.ord, ordId:item.ordId, ordUuid:item.ordUuid, sentQty:item.sentQty,
      sentAll:groups.has(item.ordUuid) ? groups.get(item.ordUuid).sentAll : Number(item.qty), no, counter:counter.id, template:customer.template, createTime:now}
    for (const key of fields) record[key] = item[key] == null ? null : item[key]
    const columns = Object.keys(record)
    await run(`INSERT INTO delivery (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`, Object.values(record))
    await run('INSERT INTO inventoryout (delivery,prd,sentQty,sentTime,cust,createTime) VALUES (?,?,?,?,?,?)', [id,item.prd,item.qty,item.time,customer.id,now])
    await stock(run, item, Number(item.qty), now)
  }
  await run('INSERT INTO deliverygrp (cust,delivery,createTime) VALUES (?,?,?)',[customer.id,id,now])
  await run('UPDATE counter SET number=?, time=? WHERE id=?',[no,now,counter.id])
  return {message:'已保存到历史'}
}))

const latestSql = 'SELECT * FROM deliverygrp WHERE cust=? AND off=0 ORDER BY createTime DESC,id DESC LIMIT 1'

endpoint('/deleteDelivery', data => query.transaction(async run => {
  const customer = await lockCustomer(run, data.cust)
  const [group] = await run(latestSql + ' FOR UPDATE',[customer.id])
  requireValue(group && group.id === positiveId(data.grp), '只能撤销该客户最新的有效送货单')
  const items = await run('SELECT * FROM delivery WHERE id=? AND off=0 FOR UPDATE',[group.delivery])
  requireValue(items.length, '缺少送货明细')
  const now = Date.now()
  const groups = new Map()
  for (const item of items) {
    const qty = Number(item.qty)
    requireValue(Number.isFinite(qty), '历史数量需要核对')
    if ([3,4].includes(item.template)) await changeOrder(run, item, -qty, groups)
    await stock(run,item,-qty,now)
  }
  await updateGroups(run,groups)
  await run('UPDATE delivery SET off=1 WHERE id=?',[group.delivery])
  await run('UPDATE inventoryout SET off=1 WHERE delivery=?',[group.delivery])
  await run('UPDATE deliverygrp SET off=1 WHERE id=?',[group.id])
  const first = items[0]
  // 单号按客户、按月计数。跨月撤销旧单时不能回退本月的计数器。
  if (month(first.createTime) === month(now)) {
    const result = await run('UPDATE counter SET number=? WHERE id=? AND cust=? AND number=?',[first.no-1,first.counter,customer.id,first.no])
    requireValue(result.affectedRows === 1, '单号与计数器不一致')
  }
  const [latest] = await run(latestSql,[customer.id])
  return {message:'删除成功',cust:latest ? latest.delivery : '-1'}
}))

endpoint('/getDeliveryHistory', async data => {
  const all = String(data.customer) === '-1'
  const where = all ? 'off=0' : 'off=0 AND cust=?'
  const params = all ? [] : [positiveId(data.customer)]
  const size = positiveId(data.pageSize || 5)
  const offset = (positiveId(data.pageNo || 1)-1)*size
  const [count] = await query('SELECT COUNT(*) AS count FROM deliverygrp WHERE '+where,params)
  const groups = await query('SELECT * FROM deliverygrp WHERE '+where+' ORDER BY createTime DESC,id DESC LIMIT ?,?',params.concat(offset,size))
  const message = [], cust = {}
  for (const group of groups) {
    const rows = await query('SELECT * FROM delivery WHERE id=?',[group.delivery])
    if (rows.length) message.push(rows.map(row => Object.assign(row,{grp:group.id})))
    if (!cust[group.cust]) {
      const [latest] = await query(latestSql,[group.cust])
      cust[group.cust] = latest && latest.delivery
    }
  }
  return {message,count:count.count,cust}
})
module.exports = router
