import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
// import Layout from '@/views/layout/Layout'

NProgress.configure({ showSpinner: false })// NProgress Configuration

/**
 * permission judge function, 判断是否有权限,暂未使用
 * @author Pan
 * @param {Array} roles - 授权角色
 * @param {String} permissionRoles - 当前角色
 * @returns {Object} - 返回过滤后结果
 */
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

/**
 * 权限菜单结构过滤
 * @author tkvern
 * @param {Object} row - 单项权限菜单
 * @returns {Object} - 返回过滤后结果
 */
function formatDateForRouter(row) {
  return {
    id: row.id,
    path: row.path,
    name: row.name,
    meta: row.meta,
    alwaysShow: row.alwaysShow || false,
    hidden: row.hidden || false
  }
}

/**
 * 服务端权限菜单list转tree
 * @author tkvern
 * @param {Array} rows - 权限菜单数组.
 * @returns {Array} - 返回菜单tree
 */
function convert(rows) {
  function exists(rows, parentId) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === parentId) return true
    }
    return false
  }

  var nodes = []
  // get the top level nodes
  for (let i = 0; i < rows.length; i++) {
    var row = rows[i]
    if (!exists(rows, row.parentId)) {
      const data = formatDateForRouter(row)
      if (row.redirect !== '') {
        data.redirect = row.redirect
      }
      nodes.push(data)
    }
  }

  var toDo = []
  for (let i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i])
  }
  while (toDo.length) {
    const node = toDo.shift()	// the parent node
    // get the children nodes
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (row.parentId === node.id) {
        const child = formatDateForRouter(row)
        if (row.redirect !== '') {
          child.redirect = row.redirect
        }
        if (node.children) {
          node.children.push(child)
        } else {
          node.children = [child]
        }
        toDo.push(child)
      }
    }
  }
  return nodes
}

/**
 * Object数组相同字段的元素,合并成一个数组
 * @author tkvern
 * @param {Array} obj - 权限菜单数组.
 * @param {String} key - 需要合并的字段
 * @returns {Array} - 返回菜单tree
 */
function j2arr(obj, key) {
  obj = obj || []
  const ret = []
  obj.forEach(item => {
    if (item.hasOwnProperty(key)) {
      ret.push(item[key])
    } else {
      ret.push(item)
    }
  })
  return ret
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist
const whiteRoute = ['Dashboard', 'Page401', 'Login', '401', '404']

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.permission_routerMaps.length !== 0) {
        const permissionRouterMaps = j2arr(store.getters.permission_routerMaps, 'name')
        if (permissionRouterMaps.indexOf(to.name) < 0) {
          // 没有权限跳转401
          if (process.env.DEBUGGER) {
            console.log('没有权限, 调试模式可以访问')
          } else {
            next({ path: '/401', replace: true, query: { noGoBack: true }})
          }
        }
      }
      if (!store.getters.isLogin) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          // const { role } = res.data // note: roles must be a array! such as: ['editor','develop']
          let { routerMaps } = res.data
          const routerFix = convert(routerMaps)
          routerMaps = whiteRoute.concat(routerMaps)
          store.dispatch('GenerateRoutes', { routerMaps, routerFix }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
        // 可删 ↑
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
