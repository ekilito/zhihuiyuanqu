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

// 执行全局指令注册
import '@/directive/index'

import './permission'

// 注册svg
import '@/icons'

// 全局注册ElementUI组件
Vue.use(ElementUI)

// 启动微前端配置
import './registerMicroApp'

// 测试环境变量
console.log('环境变量为：', process.env.VUE_APP_BASE_URL)

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