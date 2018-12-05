const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const checkRoot = require('./root')

router.post('/insertInventoryIn', async (ctx) => {
    try {
      const checkResult = checkRoot(ctx)
      if (checkResult.code === 500) {
        ctx.body = checkResult
        return
      }
      const data = ctx.request.body.data
      for (let i = 0 , len = data.length; i < len; i++) {
        const item = data[i]
        const currentTime = new Date().getTime()
        const sentQty = item.sentQty || 0
        await query(`INSERT INTO inventoryIn (prd, qty, sentQty, time, createTime) VALUES (${item.prd}, ${item.qty}, ${sentQty}, ${item.time}, ${currentTime})`)
        const result = await query(`SELECT * FROM inventory WHERE prd = ${item.prd}`)
        if (result.length === 0) {
          await query(`INSERT INTO inventory (prd, qty, sentQty, createTime, updateTime) VALUES (${item.prd}, ${item.qty}, ${sentQty}, ${currentTime}, ${currentTime})`)
        } else {
          await query(`UPDATE inventory SET qty = ${Number(result[0].qty) + Number(item.qty)}, sentQty = ${Number(result[0].sentQty) + Number(sentQty)}, updateTime = ${currentTime} WHERE prd = ${item.prd}`)
        }
      }
      ctx.body = {code: 200, message: '新增成功'}
    } catch(err) {
      throw new Error(err)
    }
  })

router.post('/getInventoryList', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx, true)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 10
    const type = data && data.type
    const database = type === 'in' ? 'inventoryIn' : 'inventory'
    let inventory
    if (data && data.prd) {
      inventory = await query(`SELECT * FROM ${database} WHERE type = 0 AND off != 1 ORDER BY createTime ASC`)
      ctx.body = {code: 200, message: inventory}
    } else {
      const count = await query(`SELECT COUNT(*) as count FROM ${database} WHERE off != 1`)
      if (type === 'in') {
        inventory = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.time FROM product p, ${database} i 
          WHERE i.prd = p.id AND i.off != 1 ORDER BY i.createTime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      } else {
        inventory = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.updateTime FROM product p, ${database} i 
          WHERE i.prd = p.id AND i.off != 1 ORDER BY i.createTime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      }
      ctx.body = {code: 200, message: inventory, count: count[0].count}
    }
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/deleteInventoryIn', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    let ids = []
    data.forEach(ele => {
      ids.push(ele.id)
    })
    await query(`UPDATE company SET off = 1, updateTime = ${new Date().getTime()} WHERE id IN ( ${ids.join()} )`)

    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const sentQty = item.sentQty || 0
      await query(`UPDATE inventoryIn SET off = 1, updateTime = ${new Date().getTime()} WHERE id = ${item.id}`)
      const result = await query(`SELECT * FROM inventory WHERE prd = ${item.prd}`)
      await query(`UPDATE inventory SET qty = ${Number(result[0].qty) - Number(item.qty)}, 
        sentQty = ${Number(result[0].sentQty) - Number(sentQty)},
        updateTime = ${new Date().getTime()} WHERE prd = ${item.prd}`)
    }
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/updInventoryIn', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    
    const data = ctx.request.body.data
    const sentQty = data.sentQty || 0
    const currentTime = new Date().getTime()
    const oldData = await query(`SELECT * FROM inventoryIn WHERE id = ${data.id}`)
    await query(`UPDATE inventoryIn SET qty = ${data.qty}, sentQty = ${sentQty}, time = ${data.time}, updateTime = ${currentTime} WHERE id = ${data.id}`)
    const inventory = await query(`SELECT * FROM inventory WHERE off != 1 AND prd = ${data.prd}`)
    await query(`UPDATE inventory SET qty = ${Number(inventory[0].qty) - Number(oldData[0].qty) + Number(data.qty)}, 
      sentQty = ${Number(inventory[0].sentQty) - Number(oldData[0].sentQty) + Number(sentQty)}`)

    const result = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.time FROM product p, inventoryIn i 
          WHERE i.id = ${data.id} AND i.prd = p.id AND i.off != 1`)
    ctx.body = {code: 200, message: '更新成功', result: result}
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/getInventoryOut', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx, true)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 10
    let inventory
    if (data && data.prd) {
      inventory = await query(`SELECT * FROM inventoryOut WHERE type = 0 AND off != 1 ORDER BY createTime ASC`)
      ctx.body = {code: 200, message: inventory}
    } else {
      const count = await query(`SELECT COUNT(*) as count FROM inventoryOut WHERE off != 1`)
      inventory = await query(`SELECT p.name as prdm, p.model as model, c.name as custm, i.id, i.sentQty, i.sentTime FROM product p, company c, inventoryOut i 
        WHERE i.prd = p.id AND i.cust = c.id AND i.off != 1 ORDER BY i.createTime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      ctx.body = {code: 200, message: inventory, count: count[0].count}
    }
  } catch(err) {
    throw new Error(err)
  }
})

module.exports = router