import request from '@/utils/request'

export function index(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: `/user/update/${data.id}`,
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}
