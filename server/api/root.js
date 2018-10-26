const checkRoot = function(ctx) {
  if (!ctx.session || !ctx.session.userInfo || ctx.session.userInfo.root !== 1) {
    return {code: 500, message: '没有权限'}
  } else {
    return {code: 200}
  }
}

module.exports = checkRoot