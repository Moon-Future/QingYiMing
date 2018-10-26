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
      const id = uuidv1()
      const currentTime = new Date().getTime()
      const order = await query(`SELECT * FROM ord WHERE ord = '${item.ord}' AND createTime != ${currentTime} AND off != 1`)
      let str = ''
      if (order.length !== 0) {
        result.push(item.name)
        continue
      }
      item.message.forEach(ele => {
        let list = [
          `'${id}'`, `'${item.ord}'`, item.customer, `'${item.custm}'`, ele.product, `'${ele.name}'`, `'${ele.model}'`,
          ele.qty, currentTime, item.time
        ]
        str += `( ${list.join()} ),`
      })
      str = str.slice(0, str.length - 1)
      await query(`INSERT INTO ord (id, ord, cust, custm, prd, prdm, model, qty, createTime, time) VALUES ${str}`)
      await query(`INSERT INTO ordgrp (ord, cust, createTime) VALUES ('${id}', ${item.customer}, ${currentTime})`)
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
    const pageSize = data && data.pageSize || 5
    let ids, ordStr = '', orderList, count
    count = await query(`SELECT COUNT(*) as count FROM ordgrp WHERE off != 1`)
    ids = await query(`SELECT * FROM ordgrp WHERE off != 1 ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    ids.forEach(ele => {
      ordStr += `'${ele.ord}',`
    })
    ordStr = ordStr.slice(0, ordStr.length - 1)
    orderList = await query(
      `
      SELECT o.ord, o.qty, o.sentQty, o.finished, o.time, c.name as custm, c.id as cust, p.name as prdm, p.id as prd, p.model
      FROM ord o, company c, product p
      WHERE o.cust = c.id AND o.prd = p.id
      AND o.off != 1 AND o.id IN (${ordStr})
      `
    )
    ctx.body = {code: 200, message: orderList, count: count[0].count}
  } catch(err) {
    ctx.body = {code: 500, message: err}
    throw new Error(err)
  }
})

router.post('/deleteOrder', async (ctx) => {

})

router.post('/updOrder', async (ctx) => {

})

module.exports = router