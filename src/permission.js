// 权限控制
import router from './router'
import { getToken } from './utils/auth'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store'
console.log('权限控制生效了')

import { asyncRoutes } from '@/router/asyncRoutes'

// 白名单
const WHITE_LIST = ['/login', '/404']

// 处理一级路由权限数据
function getFirstRoutePerms(permsArr) {
  const newArr = permsArr.map(item => {
    return item.split(':')[0]
  })
  // 数组去重
  return [...new Set(newArr)]
}

// 处理二级路由权限数据
function getSecondRoutePerms(permsArr) {
  const newArr = permsArr.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  return [...new Set(newArr)]
}

// 根据权限标识过滤路由表
function getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes) {
  // console.log(firstRoutePerms)
  if (firstRoutePerms.includes('*')) {
    // 管理员
    return asyncRoutes
  }
  // 根据一级和二级对动态路由表做过滤 return出去过滤之后的路由表
  // 1. 根据一级路由对动态路由表做过滤
  return asyncRoutes.filter(route => {
    return firstRoutePerms.includes(route.permission)
  }).map(item => {
    // 2. 对二级路由做过滤
    return {
      ...item,
      children: item.children.filter(item => secondRoutePerms.includes(item.permission))
    }
  })
}

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  nprogress.start() // 开启进度条
  const token = getToken()
  // 有token
  if (token) {
    if (to.path === '/login') {
      // 跳转到主页
      next('/')
      nprogress.done() // 手动关闭进度条
    } else {
      next()
      if (!store.state.user.profile.id) {
        // 1. 调用action函数获取用户权限数据
        const permissions = await store.dispatch('user/getProfile')
        // 2. 把后端的权限数组格式化成我们自己的俩个权限数据
        console.log('当前的权限数据为:', permissions)
        const firstRoutePerms = getFirstRoutePerms(permissions)
        console.log('一级路由权限', firstRoutePerms)
        const secondRoutePerms = getSecondRoutePerms(permissions)
        console.log('二级路由权限', secondRoutePerms)
        // 3. 根据权限标识过滤路由表 最终得到显示到左侧的路由表
        const routes = getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes)
        console.log('最终路由表', routes)
        // 4. addRoute动态添加 (当浏览器中访问路由的路径 显示渲染出来对应的组件)
        routes.forEach(route => router.addRoute(route))
        // 5. 存入Vuex渲染左侧菜单
        store.commit('menu/setMenuList', routes)
      }
    }
  } else {
    // 没有token
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})

// 路由后置守卫
router.afterEach(() => {
  nprogress.done() // done完成  关闭进度条
})
