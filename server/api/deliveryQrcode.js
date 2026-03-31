const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const checkRoot = require('./root')

router.post('/insertDeliveryQrcode', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const currentTime = new Date().getTime()
    await query(`INSERT INTO delivery_qrcode (qrcodeProductId, versionNo, seq1, seq2, qrContent, createTime) VALUES (${data.qrcodeProductId}, '${data.versionNo}', '${data.seq1}', '${data.seq2}', '${data.qrContent}', ${currentTime})`)
    ctx.body = {code: 200, message: '新增成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/getDeliveryQrcode', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 5
    const count = await query(`SELECT COUNT(*) as count FROM delivery_qrcode WHERE off != 1`)
    const result = await query(`
      SELECT d.id, d.qrcodeProductId, d.versionNo, d.seq1, d.seq2, d.qrContent, d.createTime,
             p.name as productName, p.code as productCode, p.partNo as supplierPartNo, p.size as productSize, p.weight as productWeight
      FROM delivery_qrcode d
      LEFT JOIN qrcode_product p ON d.qrcodeProductId = p.id AND p.off != 1
      WHERE d.off != 1
      ORDER BY d.createTime DESC
      LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}
    `)
    ctx.body = {code: 200, message: result, count: count[0].count}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/deleteDeliveryQrcode', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    await query(`UPDATE delivery_qrcode SET off = 1, updateTime = ${new Date().getTime()} WHERE id = ${data.id}`)
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

router.post('/updDeliveryQrcode', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    await query(`UPDATE delivery_qrcode SET qrcodeProductId = ${data.qrcodeProductId}, versionNo = '${data.versionNo}', seq1 = '${data.seq1}', seq2 = '${data.seq2}', qrContent = '${data.qrContent}', updateTime = ${new Date().getTime()} WHERE id = ${data.id}`)
    ctx.body = {code: 200, message: '更新成功'}
  } catch(err) {
    ctx.body = {code: 500, message: err}
  }
})

module.exports = router
