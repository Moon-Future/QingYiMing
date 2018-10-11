const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')

router.post('/insertUnit', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let result = []
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const currentTime = new Date().getTime()
      const unit = await query(`SELECT * FROM unit WHERE name = '${item.name}'`)
      if (unit.length !== 0) {
        result.push(item.name)
        continue
      }
      await query(`INSERT INTO unit (name, sign, createTime) VALUES ('${item.name}', '${item.sign}', ${currentTime})`)
    }
    if (result.length === 0) {
      ctx.body = {code: 200, message: '新增成功'}
    } else {
      ctx.body = {code: 200, message: `单位 ${result.join(', ')} 已存在`, repeat: true}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getUnit', async (ctx) => {
  try {
    const unitList = await query(`SELECT * FROM unit WHERE off != 1`)
    ctx.body = {code: 200, message: unitList}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteUnit', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let ids = []
    data.forEach(ele => {
      ids.push(ele.id)
    })
    await query(`UPDATE unit SET off = 1, updateTime = ${new Date().getTime()} WHERE id IN ( ${ids.join()} )`)
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/updUnit', async (ctx) => {
  try {
    const data = ctx.request.body.data
    const check = await query(`SELECT * FROM unit WHERE name = '${data.name}'`)
    if (check.length !== 0) {
      ctx.body = {code: 500, message: `单位 ${data.name} 已存在`}
      return
    }
    const upd = await query(`UPDATE unit SET name = '${data.name}', sign = '${data.sign}', updateTime = ${new Date().getTime()} WHERE id = ${data.id}`)
    const result = await query(`SELECT * FROM unit WHERE off != 1 AND id = ${data.id}`)
    ctx.body = {code: 200, message: '更新成功', result: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router