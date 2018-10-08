const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')

// async function insertUnit(name) {
//   const unit = await getUnit(name)
//   if (unit) {
//     return 
//   }
//   const oneUnit = new Unit({
//     name,
//     createTime: new Date().getTime()
//   })
//   oneUnit.save()
//   return {code: 200, message: '新增成功'}
// }

// async function getUnit(name) {
//   if (name) {
//     const unit = await Unit.find({name}).exec()
//     if (unit.length === 0) {
//       return false
//     }
//     return unit[0]
//   } else {
//     const unitList = await Unit.find({}).exec()
//     return unitList
//   }
// }


// router.post('/insertUnit', async (ctx) => {
//   try {
//     const data = ctx.request.body.data
//     let result = []
//     for (let i = 0 , len = data.length; i < len; i++) {
//       const item = data[i]
//       const product = await Product.find({model: item.model}).exec()
//       if (product.length !== 0) {
//         result.push(item)
//         continue
//       }
//       const oneProduct = new Product({
//         name: item.name,
//         model: item.model,
//         unit: item.unit,
//         createTime: new Date().getTime()
//       })
//       oneProduct.save().then(() => {

// 			}).catch(err => {

// 			})
//     }
//     result = result.length === 0 ? '新增成功' : result
//     ctx.body = {code: 200, message: result}
//   } catch(err) {
//     ctx.body = {code: 500, message: err}
//   }
// })

router.post('/getUnit', async (ctx) => {
  try {
    const unitList = await query(`SELECT * FROM unit`)
    ctx.body = {code: 200, message: unitList}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

// router.post('/deleteUnit', async (ctx) => {
//   try {
//     const data = ctx.request.body.data
//     let modelList = []
//     data.forEach(ele => {
//       modelList.push(ele.model)
//     });
//     const product = await Product.remove({model: {$in: modelList}}).exec()
//     ctx.body = {code: 200, message: '删除成功'}
//   } catch(err) {
//     ctx.body = {code: 500, message: err}
//   }
// })

// module.exports = {
//   router,
//   insertUnit,
//   getUnit
// }
module.exports = router