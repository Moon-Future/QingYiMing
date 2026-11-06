const mysql = require('mysql')
const config = require('./config')
const pool = mysql.createPool(config)
// mysql 驱动会把对象和嵌套数组展开为 SQL，因此每个占位符只接受单个字段值。
function validateParams(values) {
  if (values && !values.every(value => value == null || ['number', 'boolean', 'string'].includes(typeof value))) {
    throw new Error('数据库参数格式无效')
  }
}
const query = (sql, values) => {
  validateParams(values)
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = query
query.transaction = async function transaction(work) {
  const connection = await new Promise((resolve, reject) =>
    pool.getConnection((err, connection) => err ? reject(err) : resolve(connection)))
  const run = (sql, params) => new Promise((resolve, reject) => {
    validateParams(params)
    connection.query(sql, params, (err, rows) => err ? reject(err) : resolve(rows))
  })
  try {
    await run('START TRANSACTION')
    const result = await work(run)
    await run('COMMIT')
    return result
  } catch (error) {
    await run('ROLLBACK')
    throw error
  } finally {
    connection.release()
  }
}
