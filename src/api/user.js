import request from '@/utils/request'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
// 函数： 参数 + 逻辑 + 返回值
export function loginAPI(data) {
  return request({
    url: '/park/login', // baseURL + url
    method: 'POST',
    data: data // 请求体参数
  })
}
// loginAPI({ mobile: '13211111111', password: 'admin123'}).then(res => console.log(res))
// async await

/**
 * 园区管理-企业列表
 * @param {*} params {name:string,page:string,pageSize:string}
 */
export function getEnterPriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    method: 'GET',
    params
  })
}

/**
 * 园区管理-删除企业
 * @param {*} id string
 */
export function delEnterPriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}

/**
 * @description: 获取用户信息
 * @param {*} data {}
 * @return {*} promise
 */
export function getProfileAPI() {
  return request({
    url: '/park/user/profile',
    method: 'GET'
  })
}
