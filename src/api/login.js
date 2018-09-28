import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    account: username,
    password
  }
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(id) {
  return request({
    url: '/admin/getuserinfo',
    method: 'post',
    params: { id }
  })
}

