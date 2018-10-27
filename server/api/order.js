const Router = require('koa-router')
const router = new Router()
const uuidv1 = require('uuid/v1');
const query = require('../database/init')
const checkRoot = require('./root')

router.post('/insertOrder', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    
    const data = ctx.request.body.data
    let result = []
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const uuid = uuidv1()
      const currentTime = new Date().getTime()
      const order = await query(`SELECT * FROM ord WHERE ord = '${item.ord}' AND createTime != ${currentTime} AND off != 1`)
      let str = ''
      if (order.length !== 0) {
        result.push(item.name)
        continue
      }
      item.message.forEach(ele => {
        let list = [
          `'${uuid}'`, `'${item.ord}'`, item.cust, `'${item.custm}'`, ele.prd, `'${ele.prdm}'`, `'${ele.model}'`,
          ele.qty, currentTime, item.time
        ]
        str += `( ${list.join()} ),`
      })
      str = str.slice(0, str.length - 1)
      await query(`INSERT INTO ord (uuid, ord, cust, custm, prd, prdm, model, qty, createTime, time) VALUES ${str}`)
      await query(`INSERT INTO ordgrp (ord, cust, createTime) VALUES ('${uuid}', ${item.customer}, ${currentTime})`)
    }
    if (result.length === 0) {
      ctx.body = {code: 200, message: '新增成功'}
    } else {
      ctx.body = {code: 200, message: `订单编号 ${result.join(', ')} 已存在`, repeat: true}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
    throw new Error(err)
  }
})

router.post('/getOrder', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
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
      ids = await query(`SELECT * FROM ordgrp WHERE cust = ${customerId} AND finished != 1 AND off != 1 `)
      for (let i = 0, len = ids.length; i < len; i++) {
        let list = await query(
          `
          SELECT o.id, o.uuid, o.ord, o.qty, o.sentQty, o.finished, o.time, o.createTime, c.name as custm, c.id as cust, p.name as prdm, p.id as prd, p.model, u.name as unitm, u.id as unit
          FROM ord o, company c, product p, unit u
          WHERE o.cust = c.id AND o.prd = p.id AND p.unit = u.id
          AND o.off != 1 AND o.uuid = '${ids[i].ord}'
          `
        )
        orderList = orderList.concat(list)
      }
      number = await query(`SELECT * FROM counter WHERE type = 'delivery' AND cust = ${customerId}`)
      if (number.length === 0) {
        await query(`INSERT INTO counter (number, cust, type, time) VALUES (0, ${customerId}, 'delivery', ${new Date().getTime()})`)
        number = await query(`SELECT * FROM counter WHERE type = 'delivery' AND cust = ${customerId}`)
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
      count = await query(`SELECT COUNT(*) as count FROM ordgrp WHERE off != 1`)
      ids = await query(`SELECT * FROM ordgrp WHERE off != 1 ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      for (let i = 0, len = ids.length; i < len; i++) {
        let list = await query(
          `
          SELECT o.id, o.uuid, o.ord, o.qty, o.sentQty, o.finished, o.time, o.createTime, c.name as custm, c.id as cust, p.name as prdm, p.id as prd, p.model
          FROM ord o, company c, product p
          WHERE o.cust = c.id AND o.prd = p.id
          AND o.off != 1 AND o.uuid = '${ids[i].ord}'
          `
        )
        orderList = orderList.concat(list)
      }
      ctx.body = {code: 200, message: orderList, count: count[0].count}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
    throw new Error(err)
  }
})

router.post('/updOrder', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    
    const data = ctx.request.body.data
    let result = []
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const currentTime = new Date().getTime()
      let strInsert = '', strUpd = ''
      for (let j = 0; j < item.message.length; j++) {
        let ele = item.message[j]
        if (ele.id === undefined) {
          let list = [
            `'${item.uuid}'`, `'${item.ord}'`, item.cust, `'${item.custm}'`, ele.prd, `'${ele.prdm}'`, `'${ele.model}'`,
            ele.qty, item.createTime, item.time
          ]
          strInsert += `( ${list.join()} ),`
        } else {
          await query(`UPDATE ord SET prd = ${ele.prd}, prdm = '${ele.prdm}', model = '${ele.model}', 
            qty = ${ele.qty}, time = ${item.time}, updateTime = ${currentTime}, off = ${ele.off} WHERE id = ${ele.id}`)
        }
      }
      str = str.slice(0, str.length - 1)
      await query(`INSERT INTO ord (uuid, ord, cust, custm, prd, prdm, model, qty, createTime, time) VALUES ${str}`)
    }
    ctx.body = {code: 200, message: '更新成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
    throw new Error(err)
  }
})

module.exports = router