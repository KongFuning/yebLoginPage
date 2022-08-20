const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer:{
    // 代理两台服务
    proxy:{
      // 如果请求路径/api则代理到RollApi接口
      '/api':{
        target:'https://www.mxnzp.com/',
        ws:false,
        changeOrigin:true,
        pathReWrite:{
          '^/api':'/api'
        },
      },
      // 如果请求路径/则代理到后端服务器
      '/':{
        target:'http://localhost:8088/',
        ws:false,
        changeOrigin:true,
        pathReWrite:{
          '^/':'/'
        },
      },
    }
  }
}