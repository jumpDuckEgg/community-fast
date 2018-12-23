import request from '@/utils/request'

export function login(username, password, captcha, uuid) {
  return request({
    url: '/sys/login',
    method: 'post',
    data: {
      username,
      password,
      captcha,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'post'
  })
}

