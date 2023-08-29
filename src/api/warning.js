import request from '@/utils/request'

// 获取告警记录列表
export function getWarningListAPI(params) {
  return request({
    url: '/pole/warning/list',
    params
  })
}
