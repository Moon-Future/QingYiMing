const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')

router.post('/insertCompany', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let result = []
    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const currentTime = new Date().getTime()
      const company = await query(`SELECT * FROM company WHERE name = '${item.name}'`)
      if (company.length !== 0) {
        result.push(item.name)
        continue
      }
      await query(`INSERT INTO company (name, alias, type, createTime) VALUES ('${item.name}', '${item.alias}', ${0}, ${currentTime})`)
    }
    if (result.length === 0) {
      ctx.body = {code: 200, message: '新增成功'}
    } else {
      ctx.body = {code: 200, message: `公司 ${result.join(', ')} 已存在`, repeat: true}
    }
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getCompany', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let company
    if (data && data.type === 0) {
      company = await query(`SELECT * FROM company WHERE type = 0`)
    } else {
      company = await query(`SELECT * FROM company`)
    }
    ctx.body = {code: 200, message: company}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteCompany', async (ctx) => {
  try {
    const data = ctx.request.body.data
    let ids = []
    data.forEach(ele => {
      ids.push(ele.id)
    })
    await query(`DELETE FROM company WHERE id IN ( ${ids.join()} )`)
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router