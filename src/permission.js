// 权限控制
import router from './router'
import { getToken } from './utils/auth'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 白名单
const WHITE_LIST = ['/login', '/404']

// 路由前置守卫
router.beforeEach((to, from, next) => {
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
