import { asyncRouterMap, constantRouterMap } from '@/router'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, { routers }) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // const { routerMaps } = data
        // let { routerFix } = data
        // if (process.env.DEBUGGER) {
        //   console.log('Debugger Is Open, load All Menu')
        //   routerFix = asyncRouterMap
        // }
        const accessedRouters = asyncRouterMap
        commit('SET_ROUTERS', { routers: accessedRouters })
        resolve()
      })
    }
  }
}

export default permission
