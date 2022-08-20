import Vue from 'vue'
import App from './App.vue'
// 路由
import router from './router'
// 引入elementUI组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入axios
import './axios'
// 引入粒子特效，作为登录页背景
import VueParticles from 'vue-particles'


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueParticles)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
