import request from '@/utils/request'

/**
 * 获得列表数据
 * @param {*} params
 * @returns
 */
export function getRodListAPI(params) {
  return request({
    url: '/pole/info/list',
    params
  })
}

/**
 * 增加一体杆
 * @param {*} data
 * @returns
 */
export function addRodAPI(data) {
  return request({
    url: '/pole/info',
    method: 'POST',
    data
  })
}

/**
 * 获取关联区域下拉列表
 * @param {*} data
 * @returns
 */
export function areaRodAPI() {
  return request({
    url: '/parking/area/dropList'
  })
}

/**
 * 删除一体杆
 * @param {*} data
 * @returns
 */
export function delRodAPI(ids) {
  return request({
    url: `/pole/info/${ids}`,
    method: 'DELETE'
  })
}

/**
 * 编辑一体杆
 * @param {*} data
 * @returns
 */
export function editRodAPI(data) {
  return request({
    url: `/pole/info`,
    method: 'PUT',
    data
  })
}
