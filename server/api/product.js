const Router = require('koa-router')
const router = new Router()
const Product = require('../database/schema/product')
const { insertUnit } = require('./unit')

router.post('/insertProduct', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let result = []
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const product = await Product.find({model: item.model}).exec()
      if (product.length !== 0) {
        result.push(item)
        continue
      }
      if (item.unitId === undefined) {
        await insertUnit(item.unit)
      }
      const oneProduct = new Product({
        name: item.name,
        model: item.model,
        unit: item.unit,
        createTime: new Date().getTime()
      })
      oneProduct.save().then(() => {

			}).catch(err => {

			})
    }
    result = result.length === 0 ? '新增成功' : result
    ctx.body = {code: 200, message: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getProduct', async (ctx) => {
  try {
    const data = ctx.request.body.data
    const product = await Product.find({}).exec()
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