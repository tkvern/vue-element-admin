import request from '@/utils/request'

/**
 * 用户登录
 * @author tkvern <tkvern@qq.com>
 * @exports api/login/loginByUsername
 * @param {String} username - 用户名.
 * @param {String} password - 密码
 * @returns {Promise} - 返回request对象
 */
export function loginByUsername(username, password) {
  const data = {
    account: username,
    // username,
    pwd: password
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 退出登录
 * @author tkvern <tkvern@qq.com>
 * @exports api/login/logout
 * @returns {Promise} - 返回request对象
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 获取用户信息以及菜单信息
 * @author tkvern <tkvern@qq.com>
 * @exports api/login/getUserInfo
 * @returns {Promise} - 返回request对象
 */
export function getUserInfo() {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}

/**
 * 获取动态路由
 * @author tkvern <tkvern@qq.com>
 * @exports api/login/getAsyncRouterMap
 * @returns {Promise} - 返回request对象
 */
export function getAsyncRouterMap(token) {
  return request({
    url: '/routermaps',
    method: 'get',
    params: { token }
  })
}
