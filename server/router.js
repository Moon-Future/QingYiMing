const Router = require('koa-router')
const product = require('./api/product')
const customer = require('./api/customer')
const { router: unit } = require('./api/unit')
const router = new Router({
  prefix: '/api'
})

router.use('/product', product.routes())
router.use('/customer', customer.routes())
router.use('/unit', unit.routes())

module.exports = router