const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

// 跨域真实访问地址
module.exports = {
  devServer:{
    port:8080,
    proxy:'https://www.mxnzp.com/'
  }
}