const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')

router.post('/insertOrder', async (ctx) => {
  try {
    if (!ctx.session) {
      ctx.body = {code: 500, message: '没有权限'}
      return
    }
    const data = ctx.request.body.data
    ctx.body = {code: 200, message: data}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getOrder', async (ctx) => {

})

router.post('/deleteOrder', async (ctx) => {

})

router.post('/updOrder', async (ctx) => {

})

module.exports = router