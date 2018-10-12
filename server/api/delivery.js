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
      await query(`UPDATE counter SET number = ${counter.number} WHERE id = ${counter.id}`)
    } else {
      await query(`INSERT INTO counter (number, type) VALUES (${counter.number}, 'delivery')`)
    }
    await query(
      `
      INSERT INTO delivery (id, prd, prdm, cust, custm, model, nun, unit, unitm, qty, qtyR, ptime, lot, remark, time, no, counter, createTime)
      VALUES
      ${str}
      `
    )
    await query(`INSERT INTO deliverygrp (delivery, createTime) VALUES ('${id}', ${currentTime})`)
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
    const count = await query(`SELECT COUNT(*) as count FROM deliverygrp`)
    const ids = await query(`SELECT * FROM deliverygrp ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    let result = []
    for (let i = 0, len = ids.length; i < len; i++) {
      let list = await query(`SELECT * FROM delivery WHERE id = '${ids[i].delivery}'`)
      if (list.length !== 0) {
        list.forEach(ele => {
          ele.grp = ids[i].id
        })
        result.push(list)
      }
    }
    ctx.body = {code: 200, message: result, count: count[0].count}
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
    let str = ''
    ids.forEach(id => {
      str += `'${id}',`
    })
    str = str.slice(0, str.length - 1)
    await query(`UPDATE deliverygrp SET off = 1 WHERE id = ${grp}`)
    await query(`UPDATE delivery SET off = 1 WHERE id IN (${str})`)
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router