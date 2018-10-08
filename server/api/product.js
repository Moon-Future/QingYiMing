const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')

router.post('/insertProduct', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let result = []
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const currentTime = new Date().getTime()
      const product = await query(`SELECT * FROM product WHERE model = '${item.model}'`)
      if (product.length !== 0) {
        result.push(item.model)
        continue
      }
      await query(`INSERT INTO product (name, model, unitId, provider, createTime) VALUES ('${item.name}', '${item.model}', ${item.unit}, ${1}, ${currentTime})`)
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
    const data = ctx.request.body.data
    const product = await query(`SELECT p.name, p.model, u.name as unit, c.name as provider FROM product p, unit u, company c WHERE p.unitId = u.id AND p.provider = c.id`)
    ctx.body = {code: 200, message: product}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteProduct', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let modelList = []
    data.forEach(ele => {
      modelList.push(ele.model)
    });
    const product = await Product.remove({model: {$in: modelList}}).exec()
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router