import request from '@/utils/request'

export function index(query) {
  return request({
    url: '/roles',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/roles/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/roles/update',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/roles/delete',
    method: 'post',
    data
  })
}
