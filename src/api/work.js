import request from '@/utils/request'

/**
 * 获取园区信息
 * @returns
 */
export function getInfoAPI() {
  return request({
    url: '/home/workbench/info'
  })
}
