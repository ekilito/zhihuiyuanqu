import request from '@/utils/request'

/**
 * 获取员工列表
 * @param { page, pageSize, name} params
 * @returns
 */
export function getEmployeeListAPI(params) {
  return request({
    url: '/park/sys/user',
    params
  })
}

/**
 * 添加员工
 * @returns
 */
export function createEmployeeAPI(data) {
  return request({
    url: `/park/sys/user`,
    method: 'POST',
    data
  })
}

/**
 * 删除员工
 * @returns
 */
export function delEmployeeAPI(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取用户详情
 * @param {*} id
 * @returns
 */

export function userdetailsAPI(id) {
  return request({
    url: `/park/sys/user/${id}`
  })
}

/**
 * 编辑
 * @param {*} id
 * @returns
 */
export function editUserAPI(data) {
  return request({
    url: '/park/sys/user',
    method: 'PUT',
    data
  })
}

/**
 * 重置密码
 * @param {*} id
 * @returns
 */
export function resetPasswordAPI(id) {
  return request({
    url: '/park/sys/user/resetPwd',
    method: 'PUT',
    data: { id }
  })
}
