const Router = require('koa-router')
const router = new Router()
const uuidv1 = require('uuid/v1');
const query = require('../database/init')
const checkRoot = require('./root')

router.post('/insertOrder', async ctx => {
  const permission = checkRoot(ctx)
  if (permission.code !== 200) { ctx.body = permission; return }
  try {
    const orders = ctx.request.body.data
    if (!Array.isArray(orders) || !orders.length) throw new Error('订单数据不能为空')
    const repeated = []
    for (const item of orders) {
      if (!Array.isArray(item.message) || !item.message.length) throw new Error('订单明细不能为空')
      const duplicates = await query('SELECT 1 FROM ord o JOIN ordgrp g ON g.ord=o.uuid WHERE o.ord=? AND o.cust=? AND o.off=0 AND g.off=0 LIMIT 1', [item.ord,item.cust])
      if (duplicates.length) { repeated.push(item.name || item.ord); continue }
      // 同一张订单的明细和汇总一起提交，避免某一行写入失败后留下半张订单。
      await query.transaction(async run => {
        const id = uuidv1()
        const now = Date.now()
        let total = 0
        for (const line of item.message) {
          const qty = Number(line.qty)
          if (!Number.isSafeInteger(qty) || qty <= 0) throw new Error('订单数量无效')
          total += qty
          await run('INSERT INTO ord (uuid,ord,cust,custm,prd,prdm,model,qty,createTime,time,version,remark) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            [id,item.ord,item.cust,item.custm,line.prd,line.prdm,line.model,qty,now,item.time,line.version || '',line.remark || ''])
        }
        await run('INSERT INTO ordgrp (ord,cust,qtyAll,createTime) VALUES (?,?,?,?)', [id,item.cust,total,now])
      })
    }
    ctx.body = repeated.length ? {code:200,message:`订单编号 ${repeated.join(', ')} 已存在`,repeat:true} : {code:200,message:'新增成功'}
  } catch (error) {
    ctx.status = 409
    ctx.body = {code:500,message:error.message}
  }
})

router.post('/getOrder', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx, true)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    
    const data = ctx.request.body.data
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 10
    const customerId = data && data.customerId
    let ids, orderList = [], count
    if (customerId) {
      ids = await query(`SELECT * FROM ordgrp WHERE cust = ? AND finished != 1 AND off != 1 `, [customerId])
      for (let i = 0, len = ids.length; i < len; i++) {
        let list = await query(`
          SELECT o.id, o.uuid, o.ord, o.qty, o.sentQty, o.finished, o.time, o.createTime, o.version, o.remark, c.name as custm, c.id as cust, p.name as prdm, p.id as prd, p.model, u.name as unitm, u.id as unit, s.nun
          FROM ord o
          INNER JOIN company c ON o.cust = c.id
          INNER JOIN product p ON o.prd = p.id
          INNER JOIN unit u ON p.unit = u.id
          LEFT JOIN supply s ON o.cust = s.cust AND o.prd = s.prd AND s.off != 1
          WHERE o.off != 1 AND o.uuid = ?
          `, [ids[i].ord])
        list.forEach(ele => {
          ele.qtyAll = ids[i].qtyAll
          ele.sentAll = ids[i].sentAll
        })
        orderList = orderList.concat(list)
      }
      let number = await query(`SELECT * FROM counter WHERE type = 'delivery' AND cust = ?`, [customerId])
      if (number.length === 0) {
        await query(`INSERT INTO counter (number, cust, type, time) VALUES (0, ?, 'delivery', ?)`, [customerId, new Date().getTime()])
        number = await query(`SELECT * FROM counter WHERE type = 'delivery' AND cust = ?`, [customerId])
      } else {
        // 下个月重置为0
        const time = new Date(number[0].time)
        const currentTime = new Date()
        if (currentTime.getFullYear() + '_' + (currentTime.getMonth() + 1) !== time.getFullYear() + '_' + (time.getMonth() + 1)) {
          number[0].number = 0
        }
      }
      ctx.body = {code: 200, message: {orderList, number}}
    } else {
      count = await query(`SELECT COUNT(*) as count FROM ordgrp WHERE finished != 1 AND off != 1`)
      ids = await query(`SELECT * FROM ordgrp WHERE finished != 1 AND off != 1 ORDER BY createTime DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, Number(pageSize)])
      for (let i = 0, len = ids.length; i < len; i++) {
        let list = await query(`
          SELECT o.id, o.uuid, o.ord, o.qty, o.sentQty, o.finished, o.time, o.createTime, o.version, o.remark, c.name as custm, c.id as cust, p.name as prdm, p.id as prd, p.model, s.nun
          FROM ord o
          INNER JOIN company c ON o.cust = c.id
          INNER JOIN product p ON o.prd = p.id
          LEFT JOIN supply s ON o.cust = s.cust AND o.prd = s.prd AND s.off != 1
          WHERE o.off != 1 AND o.uuid = ?
          `, [ids[i].ord])
        list.forEach(ele => {
          ele.qtyAll = ids[i].qtyAll
          ele.sentAll = ids[i].sentAll
        })
        orderList = orderList.concat(list)
      }
      ctx.body = {code: 200, message: orderList, count: count[0].count}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
    throw new Error(err)
  }
})

router.post('/getOrderHistory', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    
    const data = ctx.request.body.data
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 10
    const count = await query(`SELECT COUNT(*) as count FROM ordgrp WHERE finished = 1 AND off != 1`)
    const ids = await query(`SELECT * FROM ordgrp WHERE finished = 1 AND off != 1 ORDER BY createTime DESC LIMIT ?, ?`, [(pageNo - 1) * pageSize, Number(pageSize)])
    let orderList = []
    for (let i = 0, len = ids.length; i < len; i++) {
      let list = await query(`
        SELECT o.id, o.uuid, o.ord, o.qty, o.sentQty, o.finished, o.time, o.createTime, o.version, o.remark, c.name as custm, c.id as cust, p.name as prdm, p.id as prd, p.model
        FROM ord o, company c, product p
        WHERE o.cust = c.id AND o.prd = p.id
        AND o.off != 1 AND o.uuid = ?
        `, [ids[i].ord])
      orderList = orderList.concat(list)
    }

    ctx.body = {code: 200, message: orderList, count: count[0].count}
  } catch(err) {
    ctx.body = {code: 500, message: err}
    throw new Error(err)
  }
})

router.post('/updOrder', async ctx => {
  const permission = checkRoot(ctx)
  if (permission.code !== 200) { ctx.body = permission; return }
  try {
    const data = ctx.request.body.data
    if (!Array.isArray(data)) throw new Error('订单数据无效')
    await query.transaction(async run => {
      for (const item of data) {
        const [group] = await run('SELECT * FROM ordgrp WHERE ord = ? AND off = 0 FOR UPDATE', [item.uuid])
        if (!group || !Array.isArray(item.message)) throw new Error('订单不存在')
        const [before] = await run('SELECT COALESCE(SUM(qty),0) AS qty, COALESCE(SUM(sentQty),0) AS sent FROM ord WHERE uuid = ? AND off = 0', [group.ord])
        if (group.qtyAll !== before.qty || group.sentAll !== before.sent) {
          throw new Error('订单历史数量不一致，请先核对')
        }
        for (const line of item.message) {
          if (line.id === undefined) {
            const qty = Number(line.qty)
            if (!Number.isSafeInteger(qty) || qty <= 0) throw new Error('订单数量无效')
            await run('INSERT INTO ord (uuid,ord,cust,custm,prd,prdm,model,qty,createTime,time,version,remark) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
              [group.ord,item.ord,group.cust,item.custm,line.prd,line.prdm,line.model,qty,Date.now(),item.time,line.version || '',line.remark || ''])
            continue
          }
          const [stored] = await run('SELECT * FROM ord WHERE id = ? AND uuid = ? AND off = 0 FOR UPDATE', [line.id,group.ord])
          if (!stored) throw new Error('订单明细不存在')
          if (line.off === 1) {
            if (stored.sentQty !== 0) throw new Error('已送货的订单明细不能删除')
            await run('UPDATE ord SET off = 1, updateTime = ? WHERE id = ?', [Date.now(),stored.id])
          } else {
            const qty = Number(line.qty)
            if (!Number.isSafeInteger(qty) || qty < stored.sentQty || qty <= 0) throw new Error('订单数量不能小于已送数量')
            if (stored.sentQty > 0 && Number(line.prd) !== stored.prd) throw new Error('已送货的订单明细不能更换产品')
            await run('UPDATE ord SET prd=?,prdm=?,model=?,qty=?,finished=?,time=?,updateTime=?,version=?,remark=? WHERE id=?',
              [line.prd,line.prdm,line.model,qty,Number(stored.sentQty === qty),item.time,Date.now(),line.version || '',line.remark || '',stored.id])
          }
        }
        const [totals] = await run('SELECT COALESCE(SUM(qty),0) AS qty, COALESCE(SUM(sentQty),0) AS sent FROM ord WHERE uuid = ? AND off = 0', [group.ord])
        if (totals.qty === 0 && item.off !== 1) throw new Error('订单不能没有明细')
        if (item.off === 1 && totals.sent > 0) throw new Error('已送货的订单不能删除')
        await run('UPDATE ordgrp SET qtyAll=?, sentAll=?, finished=?, off=?, updateTime=? WHERE id=?',
          [totals.qty,totals.sent,Number(totals.qty > 0 && totals.sent === totals.qty),item.off === 1 ? 1 : 0,Date.now(),group.id])
      }
    })
    ctx.body = {code:200,message:'更新成功'}
  } catch (error) {
    ctx.status = 409
    ctx.body = {code:500,message:error.message}
  }
})

module.exports = router
