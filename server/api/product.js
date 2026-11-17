const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const checkRoot = require('./root')

router.post('/insertProduct', async (ctx) => {
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
      const product = await query(`SELECT * FROM product WHERE model = ? AND off != 1`, [item.model])
      if (product.length !== 0) {
        result.push(item.model)
        continue
      }
      await query(`INSERT INTO product (name, model, unit, provider, createTime) VALUES (?, ?, ?, ?, ?)`, [item.name, item.model, item.unit, 1, currentTime])
    }
    if (result.length === 0) {
      ctx.body = {code: 200, message: '新增成功'}
    } else {
      ctx.body = {code: 200, message: `型号 ${result.join(', ')} 已存在`, repeat: true}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getProduct', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    
    const data = ctx.request.body.data
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 10
    const productName = data && data.productId || ''
    const model = data && data.model || ''
    const time = data && data.time || []
    const startTime = time && time[0] ? time[0] : ''
    const endTime = time && time[1] ? time[1] : ''
    const filters = []
    let where = `WHERE p.unit = u.id AND p.off != 1`
    if (productName) {
      where += ' AND p.name LIKE ?'
      filters.push(`%${productName}%`)
    }
    if (model) {
      where += ' AND p.model LIKE ?'
      filters.push(`%${model}%`)
    }
    if (startTime) {
      where += ' AND p.createTime >= ?'
      filters.push(startTime)
    }
    if (endTime) {
      where += ' AND p.createTime <= ?'
      filters.push(endTime)
    }
    const count = await query(`SELECT COUNT(*) as count FROM product p, unit u ${where}`, [...filters])
    const result = await query(`SELECT p.id, p.name, p.model, u.name as unitm FROM product p, unit u ${where} ORDER BY p.createTime ASC LIMIT ?, ?`, [...filters, (pageNo - 1) * pageSize, Number(pageSize)])
    ctx.body = {code: 200, message: result, count: count[0].count}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteProduct', async (ctx) => {
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
    await query(`UPDATE product SET off = 1, updateTime = ? WHERE id IN ( ${ids.map(() => '?').join(', ') || 'NULL'} )`, [new Date().getTime(), ...ids])
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/updProduct', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    
    const data = ctx.request.body.data
    const check = await query(`SELECT * FROM product WHERE model = ? AND off != 1`, [data.model])
    if (check.length !== 0 && check[0].id != data.id) {
      ctx.body = {code: 500, message: `型号 ${data.model} 已存在`}
      return
    }
    const upd = await query(`UPDATE product SET name = ?, model = ?, unit = ?, updateTime = ? WHERE id = ?`, [data.name, data.model, data.unit, new Date().getTime(), data.id])
    const result = await query(`SELECT p.id, p.name, p.model, u.name as unitm FROM product p, unit u WHERE p.unit = u.id AND p.off != 1 AND p.id = ?`, [data.id])
    ctx.body = {code: 200, message: '更新成功', result: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router
