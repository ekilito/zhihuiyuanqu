import request from '@/utils/request'

// 获取区域列表  /parking/area/list
// page pageSize

export function getAreaListAPI(params) {
  return request({
    url: '/parking/area/list',
    params
  })
}
