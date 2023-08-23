import axios from 'axios'
import { getToken } from './auth'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'

// 1. 通用配置
// 2. 定制化配置

// 通用配置
// 1. axios实例化  axios.create() 基地址配置 baseURL + 超时时间 timeout（100ms）
// 拓展：create方法可以调用多次 每次执行都会生成一个独一无二的实例
// export default const a = asiox.create({ baseURL: 'a.com' })
// export default const b = asiox.create({ baseURL: 'b.com' })

// 2. 请求拦截器  请求头中添加token数据  接口鉴权  统一配置
// 客户端发送请求 - 请求拦截器(针对请求参数做处理) - 后端
// 拓展：可以添加多个请求拦截器
// 客户端请求 - 拦截器1(处理参数) - 拦截器2 - 后端

// 3. 响应拦截器 数据剥离 res.data / 401错误处理 / 前端自定义错误处理？
// 后端 - 响应拦截器 - 客户端
// 成功回调 200-300
// 失败回调 不在这个之间

// 如果后端不管接口成功还是失败统一返回200？

const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token
    const token = getToken()
    if (token) {
      // 前面是固定的写法  后面的token的拼接模式由后端来决定
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 错误统一处理 接口出错的时候自动执行这个回调
    console.dir(error.reaponse)

    // 错误类型有很多种，根据不同的错误码做不同的提示
    // Token 401处理
    if (error.response.status === 401) {
      Message({ type: 'warning', message: 'token超时了' })
      // 说明token超时了
      // 调用action中的退出登录
      // 1. 跳转到登录
      router.push('/login')
      // 2. 清空用户数据
      store.commit('user/clearUserInfo')
    }
    Message({
      type: 'warning',
      message: error.response.data.msg
    })
    return Promise.reject(error)
  }
)

export default service
