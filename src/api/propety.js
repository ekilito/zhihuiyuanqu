import request from '@/utils/request'

/**
 * 获取物业费列表
 * @param {*} params
 * @returns
 */
export function getPropetyListAPI(params) {
  return request({
    url: '/park/propertyfee',
    params
  })
}

/**
 * 查询所有企业
 * @param {*} params
 * @returns
 */
export function referEnterpriseAPI() {
  return request({
    url: '/park/all/enterprise'
  })
}

/**
 * 查询所有楼宇
 * @param {*} params
 * @returns
 */
export function referBuildingAPI() {
  return request({
    url: '/park/all/building'
  })
}

/**
 * 物业费预算金额
 * @param {*} params
 * @returns
 */
export function propetyBudgetAPI(data) {
  return request({
    url: '/park/propertyfee/pre/payment',
    method: 'POST',
    data
  })
}

/**
 * 增加账单
 * @param {*} params
 * @returns
 */
export function addBillAPI(data) {
  return request({
    url: '/park/propertyfee',
    method: 'POST',
    data
  })
}

/**
 * 删除账单
 * @param {*} params
 * @returns
 */
export function delBillAPI(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: 'DELETE'
  })
}

/**
 * 查看账单
 * @param {*} params
 * @returns
 */
export function viewBillAPI(id) {
  return request({
    url: `/park/propertyfee/${id}`
  })
}
