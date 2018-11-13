export function dateFormat(date, format) {
  date = typeof date === 'number' ? new Date(date) : date
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  if(/(y+)/i.test(format)){
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for(let k in o){
    if(new RegExp('(' + k + ')').test(format)){
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

export function getCookie(name) {
  const reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)")
  const arr = document.cookie.match(reg)
  return arr ? unescape(arr[2]) : null
}

export function setCookie(name, value, days = 7) {
  const exp = new Date()
  exp.setTime(exp.getTime() + days*24*60*60*1000)
  document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString()
}

export function delCookie(name) {
  setCookie(name, null, -1)
}

export function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

export function judgeMobile() {
  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight
  if (width <= 800) {
    return true
  } else {
    return false
  }
}