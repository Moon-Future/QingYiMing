const request = require('request')
const iconv = require('iconv-lite')

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

function ajaxSuggest(url) {
  // const url = `http://suggestion.baidu.com/?wd=${value}&action=opensearch`
  return new Promise((resolve, reject) => {
    request({
      url,
      encoding: null,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }, (err, res, body) => {
      if (err) {
        throw new Error(err)
      }
      resolve(JSON.parse(iconv.decode(body, 'gbk'))[1])
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

function formatDataSong(data, params) {
  const result = {
    id: data[params.id] || '',
    name: data[params.name] || '',
    src: data[params.src] || '',
    character: data[params.character] || '',
    characterID: data[params.characterID] || '',
    bgimg: data[params.bgimg] || '',
    coverimg: data[params.coverimg] || ''
  }
  return result
}

module.exports = {
  ajax,
  ajaxSuggest,
  getRandom,
  formatDataSong
}