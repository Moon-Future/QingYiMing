const request = require('request')

function ajax(url, flag = false) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (err) {
        throw new Error(err)
      }
      try {
        body = flag ? body : JSON.parse(body)
        resolve(body)
      } catch(e) {
        resolve({code: 500})
      }
    })
  })
}


function getRandom(start, end, size) {
  let allRandms = []
  size = size ? (size > end - start ? end - start : size) : 1
  for (let i = start; i <= end; i++) {
    allRandms.push(i)
  }
  allRandms.sort(() => {
    return 0.5 - Math.random()
  })
  return size == 1 ? allRandms[0] : allRandms.slice(0, size)
}

module.exports = {
  ajax,
  getRandom
}