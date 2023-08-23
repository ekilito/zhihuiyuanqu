import { loginAPI } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

export default {
  namespaced: true,
  // 数据状态 响应式 data
  state: {
    token: getToken() || '' // 优先从本地取
  },
  // 同步修改 Vuex架构中 有且只有一种提交
  mutations: {
    // 修改token
    setToken(state, token) {
      state.token = token
      // 本地存一份
      setToken(token)
    },
    clearUserInfo(state) {
      // 清除Token
      state.token = ''
      removeToken()
    }
  },
  // 异步 接口请求 + 提交mutation
  actions: {
    async doLogin(ctx, { username, password }) {
      // 1. 调用接口
      const res = await loginAPI({ username, password })
      // 2. 提交 mutation
      ctx.commit('setToken', res.data.token)
    }
  }
}
