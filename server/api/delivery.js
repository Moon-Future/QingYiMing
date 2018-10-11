const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')

router.post('/saveDelivery', async (ctx) => {
  try {
    const data = ctx.request.body.data
    const counter = data.counter
    if (counter.id) {
      await query(`UPDATE counter SET number = ${counter.number} WHERE id = ${counter.id}`)
    } else {
      await query(`INSERT INTO counter (number, type) VALUES (${counter.number}, 'delivery')`)
    }
    ctx.body = {code: 200, message: '已保存到历史'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router