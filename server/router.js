const Router = require('koa-router')
const product = require('./api/product')
const unit = require('./api/unit')
const router = new Router({
  prefix: '/api'
})

router.use('/product', product.routes())
router.use('/unit', unit.routes())

module.exports = router