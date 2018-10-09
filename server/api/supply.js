const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')

router.post('/insertSupply', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let result = []
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const currentTime = new Date().getTime()
      const supply = await query(`SELECT * FROM supply WHERE name = '${item.name}'`)
      if (supply.length !== 0) {
        result.push(item.name)
        continue
      }
      await query(`INSERT INTO supply (name, sign, createTime) VALUES ('${item.name}', '${item.sign}', ${currentTime})`)
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

router.post('/getSupply', async (ctx) => {
  try {
    const supplyList = await query(`SELECT * FROM supply`)
    ctx.body = {code: 200, message: supplyList}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteSupply', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let ids = []
    data.forEach(ele => {
      ids.push(ele.id)
    })
    await query(`DELETE FROM supply WHERE id IN ( ${ids.join()} )`)
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getOptions', async (ctx) => {
  try {
    const company = await query(`DELETE FROM company WHERE type = 0`)
    const product = await query(``)
    let result = {}
    ctx.body = {code: 200, message: result}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router