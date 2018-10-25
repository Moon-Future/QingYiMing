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
    let result
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const order = await query(`SELECT * FROM ord WHERE ord = '${item.ord}' AND off != 1`)
      if (order.length !== 0) {
        result.push(item.name)
        continue
      }
      await query(`NSERT INTO ord () VALUES ()`)
    }
    if (result.length === 0) {
      ctx.body = {code: 200, message: '新增成功'}
    } else {
      ctx.body = {code: 200, message: `订单编号 ${result.join(', ')} 已存在`, repeat: true}
    }
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