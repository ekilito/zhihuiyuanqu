// 导入 Vue核心框架2.6
import Vue from 'vue'

// 样式重置文件
import 'normalize.css/normalize.css'

// 引入elementUI组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'

import store from './store'

import router from './router'

import './permission'

// 注册svg
import '@/icons'

// 全局注册ElementUI组件
Vue.use(ElementUI)

Vue.config.productionTip = false

// 全局组件
// import '@/components/index'
// 注册自己的插件
import componentPlugin from '@/components'
Vue.use(componentPlugin)

// vue实例化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
