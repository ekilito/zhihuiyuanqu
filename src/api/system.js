import request from '@/utils/request'

export function getRoleListAPI() {
  return request({
    url: '/park/sys/role',
    method: 'GET'
  })
}
