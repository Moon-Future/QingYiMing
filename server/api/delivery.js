const Router = require('koa-router')
const router = new Router()
const uuidv1 = require('uuid/v1');
const query = require('../database/init')

router.post('/saveDelivery', async (ctx) => {
  try {
    if (!ctx.session) {
      ctx.body = {code: 500, message: '没有权限'}
      return
    }
    const data = ctx.request.body.data
    const counter = data.counter
    const delivery = data.deliveryData
    const cust = delivery[0].cust
    const id = uuidv1()
    const currentTime = new Date().getTime()
    let str = ''
    delivery.forEach(ele => {
      let list = []
      ele.createTime = currentTime
      list.push(`'${id}'`, ele.prd, `'${ele.prdm}'`, ele.cust, `'${ele.custm}'`, `'${ele.model}'`, `'${ele.nun}'`, ele.unit, `'${ele.unitm}'`,
        `'${ele.qty}'`, `'${ele.qtyR}'`, ele.ptime, `'${ele.lot}'`, `'${ele.remark}'`, ele.time, ele.no, ele.counter, ele.createTime)
      str += `( ${list.join()} ),`
    });
    str = str.slice(0, str.length - 1)
    if (counter.id) {
      await query(`UPDATE counter SET number = ${counter.number}, time = ${currentTime} WHERE id = ${counter.id}`)
    } else {
      await query(`INSERT INTO counter (number, type, time) VALUES (${counter.number}, 'delivery', ${currentTime})`)
    }
    await query(
      `
      INSERT INTO delivery (id, prd, prdm, cust, custm, model, nun, unit, unitm, qty, qtyR, ptime, lot, remark, time, no, counter, createTime)
      VALUES
      ${str}
      `
    )
    await query(`INSERT INTO deliverygrp (cust, delivery, createTime) VALUES (${cust}, '${id}', ${currentTime})`)
    ctx.body = {code: 200, message: '已保存到历史'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getDeliveryHistory', async (ctx) => {
  try {
    if (!ctx.session) {
      ctx.body = {code: 500, message: '没有权限'}
      return
    }
    const data = ctx.request.body.data
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 5
    const customer = data && data.customer
    let result = [], cust = {}, ids, count
    if (customer == '-1') {
      count = await query(`SELECT COUNT(*) as count FROM deliverygrp WHERE off != 1`)
      ids = await query(`SELECT * FROM deliverygrp WHERE off != 1 ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    } else {
      count = await query(`SELECT COUNT(*) as count FROM deliverygrp WHERE off != 1 AND cust = ${customer}`)
      ids = await query(`SELECT * FROM deliverygrp WHERE off != 1 AND cust = ${customer} ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    }
    for (let i = 0, len = ids.length; i < len; i++) {
      let list = await query(`SELECT * FROM delivery WHERE id = '${ids[i].delivery}'`)
      if (list.length !== 0) {
        list.forEach(ele => {
          ele.grp = ids[i].id
          cust[ele.cust] === undefined ? cust[ele.cust] = ele.cust : false
        })
        result.push(list)
      }
    }
    for (let key in cust) {
      let list = await query(`SELECT * FROM delivery WHERE cust = ${key} AND off != 1 ORDER BY createTime DESC LIMIT 1`)
      cust[key] = list[0].id
    }
    ctx.body = {code: 200, message: result, count: count[0].count, cust}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteDelivery', async (ctx) => {
  try {
    if (!ctx.session) {
      ctx.body = {code: 500, message: '没有权限'}
      return
    }
    const data = ctx.request.body.data
    const grp = data.grp
    const ids = data.ids
    const counter = data.counter
    const no = data.no - 1
    const cust = data.cust
    let str = ''
    ids.forEach(id => {
      str += `'${id}',`
    })
    str = str.slice(0, str.length - 1)
    await query(`UPDATE deliverygrp SET off = 1 WHERE id = ${grp}`)
    await query(`UPDATE delivery SET off = 1 WHERE id IN (${str})`)
    await query(`UPDATE counter SET number = ${no}, time = ${new Date().getTime()} WHERE id = ${counter}`)
    const result = await query(`SELECT * FROM delivery WHERE cust = ${cust} AND off != 1 ORDER BY createTime DESC LIMIT 1`)
    ctx.body = {code: 200, message: '删除成功', cust: result.length === 0 ? '-1' : result[0].id}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router