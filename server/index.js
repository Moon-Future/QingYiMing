const Koa = require('koa')
const session = require('koa-session')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const path = require('path')
const static = require('koa-static')
const router = require('./router')

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false
}
app.keys = ['login secret']
app.use(session(CONFIG, app));


app.use(static(path.join( __dirname, '../dist')))
app.use(bodyParser())
app.use(cors())
app.use(router.routes()).use(router.allowedMethods())
app.listen(8888, () => {
  console.log('listen at port 8888...')
})