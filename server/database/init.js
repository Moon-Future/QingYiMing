const mongoose = require('mongoose')
const db = 'mongodb://localhost:27017/QingYiMing'
let maxConnectTimes = 0

const connect = () => {
  return new Promise((resolve, reject) => {
  //连接数据库
  mongoose.connect(db)

  //增加数据库连接的事件监听
  mongoose.connection.on('disconnected',()=>{
    console.log('***********数据库断开***********')
    if(maxConnectTimes < 3){
      maxConnectTimes++
      //进行重连
      mongoose.connect(db)
    }else{
      reject()
      throw new Error('数据库出现问题，程序无法搞定，请人为修理......')
    }
  })
  

  //数据库出现错误的时候
  mongoose.connection.on('error',err=>{
    console.log(err)
    mongoose.connect(db)
  })

  //链接打开的时候
  mongoose.connection.once('open',()=>{
    console.log('MongoDB Connected successfully!')
    resolve()
  })
  })
}

module.exports = connect