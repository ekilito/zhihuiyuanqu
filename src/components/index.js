// 放置全局组件

// Vue.component('组件名称',组件的配置对象)

// import Vue from 'vue'

import SfButton from './sf-button'

// Vue.component('sf-button', SfButton)

/**
  开发插件两步：
  1. 定义插件
     const plugin = {
       install(Vue) {
         // 插件的逻辑
      }
    }
  2. 注册插件生效
     Vue.use(plugin) 相当于自动执行了插件内部的install方法并且传入Vue构造器
*/

const plugin = {
  install(Vue) {
    // 插件的逻辑
    console.dir(Vue)
    Vue.component('sf-button', SfButton)
  }
}

export default plugin

// main.js
// 注册自己的插件
// import componentPlugin from '@/components'
// Vue.use(componentPlugin)
