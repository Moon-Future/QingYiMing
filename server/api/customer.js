const Router = require('koa-router')
const router = new Router()
const Customer = require('../database/schema/customer')
const Product = require('../database/schema/product')
const { insertUnit } = require('./unit')

router.post('/insertCustomer', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let result = []
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const oneCustomer = new Customer({
        customer: item.customer,
        name: item.name,
        model: item.model,
        nun: item.nun,
        unit: item.unit,
        createTime: new Date().getTime()
      })
      oneCustomer.save()
    }
    result = result.length === 0 ? '新增成功' : result
    ctx.body = {code: 200, message: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getCustomer', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let customer
    if (!data) {
      customer = await Customer.find({}).exec()
    } else {
      customer = await Customer.find({customer: data.customer}).exec()
    }
    ctx.body = {code: 200, message: customer}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteCustomer', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let modelList = []
    data.forEach(ele => {
      modelList.push(ele.model)
    });
    const customer = await Customer.remove({model: {$in: modelList}}).exec()
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getOptions', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let customer
    let product
    if (!data) {
      customer = await Customer.find({}).exec()
      product = await Product.find({}).exec()
    } else {
      if (data.customer) {
        customer = await Customer.find({}).exec()
      }
      if (data.product) {
        product = await Product.find({}).exec()
      }
    }
    let list = []
    let obj = {}
    customer.forEach(ele => {
      if (!obj[ele.customer]) {
        list.push(ele)
        obj[ele.customer] = true
      }
    })
    let result = {customer: list, product: product || []}
    ctx.body = {code: 200, message: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.get('/getCustomerList', async (ctx) => {
  try {
    customer = await Customer.distinct('customer').exec();
    ctx.body = customer
  } catch(err) {
    ctx.body = 'err'
  }
})

module.exports = router