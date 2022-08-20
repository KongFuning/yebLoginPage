import axios from "axios";
import Vue from 'vue'
import router from '../router'

import {Loading} from 'element-ui'
import {Message} from 'element-ui'

axios.defaults.baseURL = 'http://localhost:8080/'
// axios.defaults.baseURL = 'https://www.mxnzp.com/api/verifycode/code/'

// // 声明请求拦截器
// let loadingInstance = null
// axios.interceptors.request.use(config =>{
//   // 展示loading效果
//   loadingInstance = Loading.service({fullscreen:true})
//   // 固定写法，要把config return出去
//   return config
//   }
// )

// // 声明响应拦截器
// axios.interceptors.response.use(response => {
//    // 关闭loading效果
//    loadingInstance.close()
//    return response
// })


Vue.prototype.$ajax = axios