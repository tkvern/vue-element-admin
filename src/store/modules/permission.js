import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(routes, roles) {
//   const res = []
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    routerMaps: []
  },
  mutations: {
    SET_ROUTERS: (state, { routers, routerMaps, routerFix }) => {
      state.addRouters = routers
      state.routerMaps = routerMaps
      state.routers = constantRouterMap.concat(routerFix)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { routerMaps } = data
        let { routerFix } = data
        // let accessedRouters = []
        if (process.env.DEBUGGER) {
          console.log('Debugger Is Open, load All Menu')
          routerFix = asyncRouterMap
        }
        // if (role.includes('admin')) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        // }
        // accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        commit('SET_ROUTERS', { routers: asyncRouterMap, routerMaps, routerFix })
        resolve()
      })
    }
  }
}

export default permission
