const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const checkRoot = require('./root')

router.post('/insertInverntoy', async (ctx) => {
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
      const product = await query(`SELECT * FROM inventory WHERE prd = '${item.prd}' AND off != 1`)
      const sentQty = item.sentQty || 0
      if (product.length !== 0) {
        result.push(item.model)
        continue
      }
      await query(`INSERT INTO inventory (prd, qty, sentQty, updateTime) VALUES (${item.prd}, ${item.qty}, ${sentQty}, ${currentTime})`)
    }
    if (result.length === 0) {
      ctx.body = {code: 200, message: '新增成功'}
    } else {
      ctx.body = {code: 200, message: `产品已存在`, repeat: true}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
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
    const currentTime = new Date()
    let inventory
    if (data && data.prd) {
      inventory = await query(`SELECT * FROM inventory WHERE type = 0 AND off != 1 ORDER BY createTime ASC`)
      ctx.body = {code: 200, message: inventory}
    } else {
      const count = await query(`SELECT COUNT(*) as count FROM inventory WHERE off != 1`)
      inventory = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.updateTime FROM product p, inventory i 
      WHERE i.prd = p.id AND i.off != 1 ORDER BY i.createTime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      ctx.body = {code: 200, message: inventory, count: count[0].count}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteCompany', async (ctx) => {
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
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/updCompany', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    
    const data = ctx.request.body.data
    const check = await query(`SELECT * FROM company WHERE name = '${data.name}' AND off != 1`)
    if (check.length !== 0 && check[0].id != data.id) {
      ctx.body = {code: 500, message: `公司 ${data.name} 已存在`}
      return
    }
    const upd = await query(`UPDATE company SET name = '${data.name}', alias = '${data.alias}', updateTime = ${new Date().getTime()}, template = ${data.template} WHERE id = ${data.id}`)
    const result = await query(`SELECT * FROM company WHERE off != 1 AND id = ${data.id}`)
    ctx.body = {code: 200, message: '更新成功', result: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router