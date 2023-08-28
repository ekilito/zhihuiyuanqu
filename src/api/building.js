import request from '@/utils/request'

/**
 * 获取楼宇列表
 * @param {*} id
 * @returns
 */
export function getRentBuildListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 获取楼宇列表
 * @param { page, pageSize} params
 * @returns
 */
export function getBuildingListAPI(params) {
  return request({
    url: '/park/building',
    params
  })
}

/**
 * 添加楼宇
 * @param {*} data
 * @returns
 */
export function createBuildingListAPI(data) {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}

/**
 * 删除楼宇
 * @param {*} data
 * @returns
 */
export function delBuildingListAPI(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}

// 编辑楼宇
export function editBuildingListAPI(data) {
  return request({
    url: '/park/building',
    method: 'PUT',
    data
  })
}
