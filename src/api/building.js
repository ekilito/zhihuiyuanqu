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
