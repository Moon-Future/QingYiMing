const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const checkRoot = require('./root')

router.post('/insertQrcodeProduct', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    let result = []
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i]
      const currentTime = new Date().getTime()
      const product = await query(`SELECT * FROM qrcode_product WHERE code = '${item.code}' AND off != 1`)
      if (product.length !== 0) {
        result.push(item.code)
        continue
      }
      await query(`INSERT INTO qrcode_product (name, code, partNo, size, weight, createTime) VALUES ('${item.name}', '${item.code}', '${item.partNo || ''}', '${item.size || ''}', '${item.weight || ''}', ${currentTime})`)
    }
    if (result.length === 0) {
      ctx.body = {code: 200, message: '新增成功'}
    } else {
      ctx.body = {code: 200, message: `编码 ${result.join(', ')} 已存在`, repeat: true}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getQrcodeProduct', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 10
    const count = await query(`SELECT COUNT(*) as count FROM qrcode_product WHERE off != 1`)
    const result = await query(`SELECT id, name, code, partNo, size, weight FROM qrcode_product WHERE off != 1 ORDER BY createTime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
    ctx.body = {code: 200, message: result, count: count[0].count}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteQrcodeProduct', async (ctx) => {
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
    await query(`UPDATE qrcode_product SET off = 1, updateTime = ${new Date().getTime()} WHERE id IN ( ${ids.join()} )`)
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/updQrcodeProduct', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const check = await query(`SELECT * FROM qrcode_product WHERE code = '${data.code}' AND off != 1`)
    if (check.length !== 0 && check[0].id != data.id) {
      ctx.body = {code: 500, message: `编码 ${data.code} 已存在`}
      return
    }
    await query(`UPDATE qrcode_product SET name = '${data.name}', code = '${data.code}', partNo = '${data.partNo || ''}', size = '${data.size || ''}', weight = '${data.weight || ''}', updateTime = ${new Date().getTime()} WHERE id = ${data.id}`)
    const result = await query(`SELECT id, name, code, partNo, size, weight FROM qrcode_product WHERE off != 1 AND id = ${data.id}`)
    ctx.body = {code: 200, message: '更新成功', result: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router
