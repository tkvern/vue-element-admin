import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    // account: username,
    username,
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
    url: '/admin/info',
    method: 'get',
    params: { id }
  })
}

export function getAsyncRouterMap(token) {
  return request({
    url: '/routermaps',
    method: 'get',
    params: { token }
  })
}
