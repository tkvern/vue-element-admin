import request from '@/utils/request'

export function index(query) {
  return request({
    url: '/menu',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/menu/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/menu/delete',
    method: 'post',
    data
  })
}
