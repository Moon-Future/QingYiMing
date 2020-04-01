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
  fs.mkdirSync(exprotFilePath)
}

router.post('/insertInventoryIn', async (ctx) => {
    try {
      const checkResult = checkRoot(ctx)
      if (checkResult.code === 500) {
        ctx.body = checkResult
        return
      }
      const data = ctx.request.body.data
      for (let i = 0 , len = data.length; i < len; i++) {
        const item = data[i]
        const currentTime = new Date().getTime()
        const sentQty = item.sentQty || 0
        await query(`INSERT INTO inventoryin (prd, qty, sentQty, time, createTime) VALUES (${item.prd}, ${item.qty}, ${sentQty}, ${item.time}, ${currentTime})`)
        const result = await query(`SELECT * FROM inventory WHERE prd = ${item.prd}`)
        if (result.length === 0) {
          await query(`INSERT INTO inventory (prd, qty, sentQty, createTime, updateTime) VALUES (${item.prd}, ${item.qty}, ${sentQty}, ${currentTime}, ${currentTime})`)
        } else {
          await query(`UPDATE inventory SET qty = ${Number(result[0].qty) + Number(item.qty)}, sentQty = ${Number(result[0].sentQty) + Number(sentQty)}, updateTime = ${currentTime} WHERE prd = ${item.prd}`)
        }
      }
      ctx.body = {code: 200, message: '新增成功'}
    } catch(err) {
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
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 10
    const type = data && data.type
    const database = type === 'in' ? 'inventoryin' : 'inventory'
    let inventory
    if (data && data.prd) {
      inventory = await query(`SELECT * FROM ${database} WHERE type = 0 AND off != 1 ORDER BY createTime ASC`)
      ctx.body = {code: 200, message: inventory}
    } else {
      const count = await query(`SELECT COUNT(*) as count FROM ${database} WHERE off != 1`)
      if (type === 'in') {
        inventory = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.time FROM product p, ${database} i 
          WHERE i.prd = p.id AND i.off != 1 ORDER BY i.createTime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      } else {
        inventory = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.updateTime FROM product p, ${database} i 
          WHERE i.prd = p.id AND i.off != 1 ORDER BY i.createTime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      }
      ctx.body = {code: 200, message: inventory, count: count[0].count}
    }
  } catch(err) {
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
    let ids = []
    data.forEach(ele => {
      ids.push(ele.id)
    })
    await query(`UPDATE company SET off = 1, updateTime = ${new Date().getTime()} WHERE id IN ( ${ids.join()} )`)

    for (let i = 0 , len = data.length; i < len; i++) {
      const item = data[i]
      const sentQty = item.sentQty || 0
      await query(`UPDATE inventoryin SET off = 1, updateTime = ${new Date().getTime()} WHERE id = ${item.id}`)
      const result = await query(`SELECT * FROM inventory WHERE prd = ${item.prd}`)
      await query(`UPDATE inventory SET qty = ${Number(result[0].qty) - Number(item.qty)}, 
        sentQty = ${Number(result[0].sentQty) - Number(sentQty)},
        updateTime = ${new Date().getTime()} WHERE prd = ${item.prd}`)
    }
    ctx.body = {code: 200, message: '删除成功'}
  } catch(err) {
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
    const oldData = await query(`SELECT * FROM inventoryin WHERE id = ${data.id}`)
    await query(`UPDATE inventoryin SET qty = ${data.qty}, sentQty = ${sentQty}, time = ${data.time}, updateTime = ${currentTime} WHERE id = ${data.id}`)
    const inventory = await query(`SELECT * FROM inventory WHERE off != 1 AND prd = ${data.prd}`)
    await query(`UPDATE inventory SET qty = ${Number(inventory[0].qty) - Number(oldData[0].qty) + Number(data.qty)}, 
      sentQty = ${Number(inventory[0].sentQty) - Number(oldData[0].sentQty) + Number(sentQty)}`)

    const result = await query(`SELECT p.name as prdm, p.model as model, i.id, i.qty, i.sentQty, i.time FROM product p, inventoryin i 
          WHERE i.id = ${data.id} AND i.prd = p.id AND i.off != 1`)
    ctx.body = {code: 200, message: '更新成功', result: result}
  } catch(err) {
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
    const pageNo = data && data.pageNo || 1
    const pageSize = data && data.pageSize || 10
    const cust = data && data.cust
    const prd = data && data.prd
    const time = data && data.time
    let fileName = ''
    let sql = cust ? ` AND i.cust = ${cust}` : ''
    sql += prd ? ` AND i.prd = ${prd}` : ''
    sql += time && time.length !== 0 ? ` AND i.sentTime >= ${time[0]} AND i.sentTime <= ${time[1]}` : ''
    let inventory
    
    if (data.export) {
      inventory = await query(`SELECT p.name as prdm, p.model as model, c.name as custm, i.id, i.sentQty, i.sentTime FROM product p, company c, inventoryout i 
        WHERE i.prd = p.id AND i.cust = c.id AND i.off != 1 ${sql} ORDER BY i.sentTime ASC`)
      inventory = await setOff(inventory)
      fileName = await exportToExcel(inventory)
      ctx.body = {code: 200, message: inventory, fileLink: `./exportFile/${fileName}`}
    } else {
      inventory = await query(`SELECT p.name as prdm, p.model as model, c.name as custm, i.id, i.sentQty, i.delivery, i.sentTime, i.createTime FROM product p, company c, inventoryout i 
        WHERE i.prd = p.id AND i.cust = c.id AND i.off != 1 ${sql} ORDER BY i.sentTime ASC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`)
      inventory = await setOff(inventory)
      const count = await query(`SELECT COUNT(*) as count FROM inventoryout i WHERE i.off != 1 ${sql}`)
      ctx.body = {code: 200, message: inventory, count: count[0].count}
    }
  } catch(err) {
    throw new Error(err)
  }
})

// 本来已经删除，但数据未更改成功 (容错)
function setOff(inventory) {
  return new Promise(async (resolve, reject) => {
    let deliveryGrp = await query(`SELECT * FROM deliverygrp`)
    let obj = {}, array = [], ids = []
    deliveryGrp.forEach(item => {
      obj[item.delivery] = item.off
    })
    for (let i = 0, len = inventory.length; i < len; i++) {
      let item = inventory[i]
      if (obj[item.delivery] == 1 && item.off != 1) {
        ids.push(item.id)
      } else {
        array.push(item)
      }
    }
    inventory = array
    if (ids.length !== 0) {
      let str = ''
      ids.forEach(id => {
        str += `'${id}',`
      })
      str = str.slice(0, str.length - 1)
      await query(`UPDATE inventoryout SET off = 1 WHERE id IN (${str})`)
    }
    resolve(inventory)
  })
}

function exportToExcel(data) {
  return new Promise((resolve, reject) => {
    let exportData = [{name: '出货单', data: []}]
    let sheetData = exportData[0].data
    sheetData.push(['产品名称', '产品型号', '送货量', '客户', '送货日期'])
    data.forEach(ele => {
      sheetData.push([ele.prdm, ele.model, ele.sentQty, ele.custm, dateFormat(ele.sentTime, 'yyyy-MM-dd')])
    })
    const buffer = xlsx.build(exportData)
    const fileName = `情义明出货数据.xlsx`
    const filePath = path.join(exprotFilePath, fileName)
    fs.writeFileSync(filePath, buffer, {falg: 'w'})
    resolve(fileName)
  })
}

module.exports = router