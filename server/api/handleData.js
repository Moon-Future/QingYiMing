const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const checkRoot = require('./root')
const { dateFormat } = require('./base')

const dataMap = {
  // counter: {time: 'date'},
  // delivery: {ptime: 'pdate', time: 'date', createTime: 'createDate', updateTime: 'updateDate'},
  // deliverygrp: {createTime: 'createDate', updateTime: 'updateDate'},
  // inventoryout: {sentTime: 'sentDate', createTime: 'createDate'},
  // ord: {time: 'date', createTime: 'createDate', updateTime: 'updateDate'},
  // ordgrp: {createTime: 'createDate', updateTime: 'updateDate'}
  delivery: ['ptime', 'time', 'createTime', 'updateTime'],
}

router.get('/handleData', async (ctx) => {
  try {
    const delivery = await query(`SELECT * FROM delivery WHERE off != 1`)
    const currentTime = new Date().getTime()
    for (let i = 0, len = delivery.length; i < len; i++) {
      const item = delivery[i]
      const qty = item.qty || 0
      await query(`INSERT INTO inventoryout (delivery, prd, sentQty, sentTime, cust, createTime) VALUES ('${item.id}', ${item.prd}, ${qty}, ${item.time}, ${item.cust}, ${currentTime})`)
    }
    ctx.body = '导数据'
  } catch(err) {
    throw new Error(err)
  }
})

// 格式化时间戳
for (let key in dataMap) {
  router.get(`/format_${key}`, async (ctx) => {
    try {
      const delivery = await query(`SELECT * FROM ${key}`)
      for (let i = 0, len = delivery.length; i < len; i++) {
        const item = delivery[i]
        const strAtr = dataMap[key].map(ele => {
          const res = item[ele]
          return `${ele}:${res ? dateFormat(Number(res), 'yyyy-MM-dd hh:mm') : ''}`
        })
        await query(`UPDATE delivery SET formatTime = ? WHERE id = ?`, [strAtr.join(', '), item.id])
      }
      ctx.body = '格式化时间'
    } catch(err) {
      throw new Error(err)
    }
  })
}

// 格式化时间戳
router.get('/formatDelivery', async (ctx) => {
  try {
    const delivery = await query(`SELECT * FROM delivery`)
    for (let i = 0, len = delivery.length; i < len; i++) {
      const item = delivery[i]
      const { ptime, time, createTime, updateTime } = item
      await query(`UPDATE delivery SET formatTime = ?`, [`ptime:${ptime && dateFormat(Number(ptime)) || ''}, time:${time && dateFormat(Number(time)) || ''}, createTime:${createTime && dateFormat(Number(createTime)) || ''}, updateTime:${updateTime && dateFormat(Number(updateTime)) || ''}`])
    }
    ctx.body = '格式化时间'
  } catch(err) {
    throw new Error(err)
  }
})


module.exports = router