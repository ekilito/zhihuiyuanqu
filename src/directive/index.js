// 放置全局指令

// 1. 全局指令的定义方式 - 没有任何功能指令模板代码跑通
// 2. 在指令中添加控制按钮显示和隐藏的逻辑

import Vue from 'vue'
import store from '@/store'
// 管理员权限特殊处理
const adminPerms = '*:*:*'
Vue.directive('auth-btn', {
  // 指令绑定的元素被渲染到dom中时自动执行
  inserted(el, binding) {
    // el:指令绑定到的那个dom元素 - button
    // binding.value:指令的绑定值 v-auth-btn="指令绑定值"
    console.log(el, binding.value)
    const perms = store.state.user.profile.permissions
    // 判断当前按钮独有的权限标识是否在我们的perms中找到 如果找得到 就显示 找不到就隐藏
    // binding.value 当前按钮独有的标识 固定的 和后端商量好的
    if (!perms.includes(binding.value) && !perms.includes(adminPerms)) {
      el.remove()
    }
  }
})
