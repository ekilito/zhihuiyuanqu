import request from '@/utils/request'

// 查看停车缴费列表  /parking/payment/list

export function getCarPayListAPI(params) {
  return request({
    url: '/parking/payment/list',
    params
  })
}
