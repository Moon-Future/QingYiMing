const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const path = require('path')
const static = require('koa-static')
const connect = require('./database/init')
const router = require('./router')

;(async () => {
  await connect()
})()

app.use(static(path.join( __dirname, '../dist')))
app.use(bodyParser())
app.use(cors())
app.use(router.routes()).use(router.allowedMethods())
app.listen(8888, () => {
  console.log('listen at port 8888...')
})