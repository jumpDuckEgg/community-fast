import request from '@/utils/request'


export function getRoutes(){
    return request({
      url: '/sys/menu/nav',
      method: 'get'
    })
  }
  