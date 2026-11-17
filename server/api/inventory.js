const Router = require('koa-router')
const router = new Router()
const query = require('../database/init')
const checkRoot = require('./root')
const { dateFormat } = require('./base')
const xlsx = require('node-xlsx').default
const fs = require('fs')
const path = require('path')
const exprotFilePath = path.join(__dirname, '../../dist/exportFile')

const exists = fs.existsSync(exprotFilePath)
if (!exists) {
  try {
    fs.mkdirSync(exprotFilePath)
  } catch (e) {
    console.log(e)
  }
}

router.post('/insertInventoryIn', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    const data = ctx.request.body.data
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i]
      const currentTime = new Date().getTime()
      const sentQty = item.sentQty || 0
      await query(`INSERT INTO inventoryin (prd, qty, sentQty, time, createTime) VALUES (?, ?, ?, ?, ?)`, [item.prd, item.qty, sentQty, item.time, currentTime])
      const result = await query(`SELECT * FROM inventory WHERE prd = ?`, [item.prd])
      if (result.length === 0) {
        await query(`INSERT INTO inventory (prd, qty, sentQty, createTime, updateTime) VALUES (?, ?, ?, ?, ?)`, [item.prd, item.qty, sentQty, currentTime, currentTime])
      } else {
        await query(`UPDATE inventory SET qty = ?, sentQty = ?, updateTime = ? WHERE prd = ?`, [Number(result[0].qty) + Number(item.qty), Number(result[0].sentQty) +
            Number(sentQty), currentTime, item.prd])
      }
    }
    ctx.body = { code: 200, message: '新增成功' }
  } catch (err) {
    throw new Error(err)
  }
})

router.post('/getInventoryList', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx, true)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const pageNo = (data && data.pageNo) || 1
    const pageSize = (data && data.pageSize) || 10
    const type = data && data.type
    const database = type === 'in' ? 'inventoryin' : 'inventory'
    let inventory
    if (data && data.prd) {
      inventory = await query(`SELECT * FROM ${database} WHERE type = 0 AND off != 1 ORDER BY createTime ASC`)
      ctx.body = { code: 200, message: inventory }
    } else {
      const count = await query(`SELECT COUNT(*) as count FROM ${database} WHERE off != 1`)
      if (type === 'in') {
        inventory = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.time FROM product p, ${database} i 
          WHERE i.prd = p.id AND i.off != 1 ORDER BY i.createTime ASC LIMIT ?, ?`, [(pageNo - 1) * pageSize, Number(pageSize)])
      } else {
        inventory = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.updateTime FROM product p, ${database} i 
          WHERE i.prd = p.id AND i.off != 1 ORDER BY i.createTime ASC LIMIT ?, ?`, [(pageNo - 1) * pageSize, Number(pageSize)])
      }
      ctx.body = { code: 200, message: inventory, count: count[0].count }
    }
  } catch (err) {
    throw new Error(err)
  }
})

router.post('/deleteInventoryIn', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i]
      const sentQty = item.sentQty || 0
      await query(`UPDATE inventoryin SET off = 1, updateTime = ? WHERE id = ?`, [new Date().getTime(), item.id])
      const result = await query(`SELECT * FROM inventory WHERE prd = ?`, [item.prd])
      await query(`UPDATE inventory SET qty = ?,
        sentQty = ?,
        updateTime = ? WHERE prd = ?`, [Number(result[0].qty) - Number(item.qty), Number(result[0].sentQty) - Number(sentQty), new Date().getTime(), item.prd])
    }
    ctx.body = { code: 200, message: '删除成功' }
  } catch (err) {
    throw new Error(err)
  }
})

router.post('/updInventoryIn', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const sentQty = data.sentQty || 0
    const currentTime = new Date().getTime()
    const oldData = await query(`SELECT * FROM inventoryin WHERE id = ?`, [data.id])
    await query(`UPDATE inventoryin SET qty = ?, sentQty = ?, time = ?, updateTime = ? WHERE id = ?`, [data.qty, sentQty, data.time, currentTime, data.id])
    await query(
      'UPDATE inventory SET qty = qty + ?, sentQty = COALESCE(sentQty, 0) + ?, updateTime = ? WHERE prd = ? AND off != 1',
      [Number(data.qty) - Number(oldData[0].qty), Number(sentQty) - Number(oldData[0].sentQty), currentTime, oldData[0].prd]
    )

    const result = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.time FROM product p, inventoryin i 
          WHERE i.id = ? AND i.prd = p.id AND i.off != 1`, [data.id])
    ctx.body = { code: 200, message: '更新成功', result: result }
  } catch (err) {
    throw new Error(err)
  }
})

router.post('/getInventoryOut', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx, true)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }

    const data = ctx.request.body.data
    const pageNo = Number((data && data.pageNo) || 1)
    const pageSize = Number((data && data.pageSize) || 10)
    const cust = data && data.cust
    const prd = data && data.prd
    const time = data && data.time
    const isLuoTuo = cust === '' || Number(cust) === 6 // 骆驼集团襄阳蓄电池有限公司，查询物料编码
    if (!Number.isSafeInteger(pageNo) || pageNo < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1) {
      ctx.body = { code: 500, message: '分页参数无效' }
      return
    }
    let fileName = ''
    let sql = ' AND NOT EXISTS (SELECT 1 FROM deliverygrp g WHERE g.delivery = i.delivery AND g.off = 1)'
    const params = []
    for (const [field, value] of [['cust', cust], ['prd', prd]]) {
      if (value === '' || value === undefined || value === null) continue
      const id = Number(value)
      if (!Number.isSafeInteger(id) || id < 1) {
        ctx.body = { code: 500, message: '筛选参数无效' }
        return
      }
      sql += ` AND i.${field} = ?`
      params.push(id)
    }
    if (time && time.length) {
      if (!Array.isArray(time) || time.length !== 2 || !time.every(value => Number.isSafeInteger(Number(value)))) {
        ctx.body = { code: 500, message: '日期参数无效' }
        return
      }
      sql += ' AND i.sentTime >= ? AND i.sentTime <= ?'
      params.push(Number(time[0]), Number(time[1]))
    }
    let inventory

    if (data.export) {
      inventory = await query(`SELECT p.name as prdm, p.model as model, c.name as custm, i.id, i.sentQty, i.delivery, i.sentTime, s.nun FROM inventoryout i
        INNER JOIN product p ON i.prd = p.id
        INNER JOIN company c ON i.cust = c.id
        LEFT JOIN (SELECT cust, prd, MAX(nun) AS nun FROM supply WHERE off != 1 GROUP BY cust, prd) s ON i.cust = s.cust AND i.prd = s.prd
        WHERE i.off != 1 ${sql} ORDER BY i.sentTime ASC`, params)
      fileName = await exportToExcel(inventory, isLuoTuo)
      ctx.body = { code: 200, message: inventory, fileLink: `./exportFile/${fileName}` }
    } else {
      inventory = await query(`SELECT p.name as prdm, p.model as model, c.name as custm, i.id, i.sentQty, i.delivery, i.sentTime, i.createTime, s.nun FROM inventoryout i
        INNER JOIN product p ON i.prd = p.id
        INNER JOIN company c ON i.cust = c.id
        LEFT JOIN (SELECT cust, prd, MAX(nun) AS nun FROM supply WHERE off != 1 GROUP BY cust, prd) s ON i.cust = s.cust AND i.prd = s.prd
        WHERE i.off != 1 ${sql} ORDER BY i.sentTime ASC LIMIT ${(pageNo - 1) *
        pageSize}, ${pageSize}`, params)
      const count = await query(`SELECT COUNT(*) as count FROM inventoryout i WHERE i.off != 1 ${sql}`, params)
      ctx.body = { code: 200, message: inventory, count: count[0].count }
    }
  } catch (err) {
    throw new Error(err)
  }
})

function exportToExcel(data, isLuoTuo) {
  return new Promise((resolve, reject) => {
    let exportData = [{ name: '出货单', data: [] }]
    let sheetData = exportData[0].data
    const title = ['产品名称', '产品型号', '送货量', '客户', '送货日期']
    if (isLuoTuo) {
      title.unshift('物料编码')
    }
    sheetData.push(title)
    data.forEach((ele) => {
      const data = [ele.prdm, ele.model, ele.sentQty, ele.custm, dateFormat(ele.sentTime, 'yyyy-MM-dd')]
      if (isLuoTuo) {
        data.unshift(ele.nun)
      }
      sheetData.push(data)
    })
    const buffer = xlsx.build(exportData)
    const fileName = `情义明出货数据.xlsx`
    const filePath = path.join(exprotFilePath, fileName)
    fs.writeFileSync(filePath, buffer, { falg: 'w' })
    resolve(fileName)
  })
}

module.exports = router
