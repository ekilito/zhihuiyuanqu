import { routes, resetRouter } from '@/router'
// 为了显示工作台 静态路由表当成初始值
// 拿到静态路由表之后 再次组合起来 左侧的菜单既可以显示静态也可以显示动态
export default {
  namespaced: true,
  state: {
    menuList: [...routes] // 存入动态筛选过后的路由表
  },
  mutations: {
    setMenuList(state, asyncRoutes) {
      // state.menuList = [...state.menuList, ...asyncRoutes]
      state.menuList = [...routes, ...asyncRoutes]
    },
    // 解决切换用户有缓存的bug
    // 方案：在用户退出登录时
    // 1. 调用清空路由的reset方法
    // 2. 手动把Vuex中的数据也清空
    // 3. 用户信息也清空
    // 退出清空路由
    resetRouter(state) {
      resetRouter()
      state.menuList = [...routes]
    }
  }
}
