import request from '@/utils/request'

export function getRoleListAPI() {
  return request({
    url: '/park/sys/role',
    method: 'GET'
  })
}

/**
 * 获取角色列表
 * @param { page, pageSize} params
 * @returns
 */
export function getroleListAPI(params) {
  return request({
    url: '/park/sys/role',
    params
  })
}

/**
 * 获取tree权限列表
 * @returns
 */
export function getTreeListAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}

/**
 * 获取当前角色权限点列表
 * @returns
 */
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}

/**
 * 获取角色成员列表
 * @returns
 */
export function getRoleUserAPI(roleId) {
  return request({
    url: `/park/sys/roleUser/${roleId}`
  })
}
