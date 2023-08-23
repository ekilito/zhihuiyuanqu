// 权限控制
import router from './router'
import { getToken } from './utils/auth'

// 白名单
const WHITE_LIST = ['/login', '/404']

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  // 有token
  if (token) {
    next()
  } else {
    // 没有token
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
