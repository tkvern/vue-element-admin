// import { param2Obj } from '@/utils'

const userMap = {
  // admin: {
  //   // role: ['admin'],
  //   token: 'admin',
  //   introduction: '我是超级管理员',
  //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //   name: 'Super Admin'
  // },
  // editor: {
  //   // role: ['editor'],
  //   token: 'editor',
  //   introduction: '我是编辑',
  //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //   name: 'Normal Editor'
  // }

  admin: {
    introduction: '我是超级管理员',
    name: 'Super Admin',
    'sid': '17812m0dZmFIdjxERPcXPRoYRnYlNPZr',
    'nickname': 'admin',
    'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    'country': '',
    'city': '',
    'province': '',
    'sex': 0,
    'role': ['admin'],
    'permission': [],
    'token': 'wk4mylDorrbEhdR1O/gn0fykT87vFT2CraPCA06kETo='
  },
  editor: {
    name: 'Normal Editor',
    introduction: '我是编辑',
    'sid': '89235m0dZmFIdjxERPcXPRoYRnYlNPZr',
    'nickname': 'editor',
    'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    'country': '',
    'city': '',
    'province': '',
    'sex': 0,
    'role': ['editor'],
    'permission': [],
    'token': 'sdh64lDorrbEhdR1O/gn0fykT87vFT2CraPCA06kETo='
  }
}

const AsyncRouterMap = {
  admin: [
    {
      id: 1,
      path: '/superuser',
      name: 'SuperUser',
      redirect: 'noredirect',
      meta: {
        title: 'superUser',
        icon: 'supervise'
      },
      parent_id: 0
    },
    {
      id: 2,
      path: 'users',
      redirect: '',
      name: 'Users',
      meta: {
        title: 'users',
        icon: 'example'
      },
      parentId: 1
    },
    {
      id: 3,
      path: 'roles',
      redirect: '',
      name: 'Roles',
      meta: {
        title: 'roles',
        icon: 'example'
      },
      parentId: 1
    },
    {
      id: 4,
      path: 'menus',
      redirect: '',
      name: 'Menus',
      meta: {
        title: 'menus',
        icon: 'example'
      },
      parentId: 1
    },
    {
      id: 5,
      path: 'operation_logs',
      redirect: '',
      name: 'OperationLogs',
      meta: {
        title: 'operationLogs',
        icon: 'example'
      },
      parentId: 1
    }
    // {
    //   id: 6,
    //   path: '/syscharts',
    //   name: 'Syscharts',
    //   redirect: 'noredirect',
    //   meta: {
    //     title: 'sysCharts',
    //     icon: 'chart'
    //   },
    //   parent_id: 0,
    //   alwaysShow: true
    // },
    // {
    //   id: 7,
    //   path: 'interface_charts',
    //   redirect: '',
    //   name: 'InterfaceCharts',
    //   meta: {
    //     title: 'interfaceCharts',
    //     icon: 'example'
    //   },
    //   parentId: 6
    // },
    // {
    //   id: 8,
    //   path: 'parameter_charts',
    //   redirect: '',
    //   name: 'ParameterCharts',
    //   meta: {
    //     title: 'parameterCharts',
    //     icon: 'example'
    //   },
    //   parentId: 6
    // },
    // {
    //   id: 9,
    //   path: 'user_charts',
    //   redirect: '',
    //   name: 'UserCharts',
    //   meta: {
    //     title: 'userCharts',
    //     icon: 'example'
    //   },
    //   parentId: 6
    // }
  ],
  editor: [
    {
      id: 1,
      path: '/nested',
      // component: '',
      redirect: '/nested/menu1/menu1-1',
      name: 'Nested',
      meta: {
        title: 'nested',
        icon: 'nested'
      },
      parent_id: 0
    },
    {
      id: 3,
      path: 'menu2',
      // component: '/src/views/nested/menu2/index',
      redirect: '',
      name: 'Menu2',
      meta: {
        title: 'menu2',
        icon: ''
      },
      parentId: 1
    }
  ]
}

export default {
  loginByUsername: config => {
    const { account } = JSON.parse(config.body)
    const username = account
    return {
      code: 200,
      'msg': '登录成功',
      data: userMap[username],
      t: new Date().getTime()
    }
  },
  getUserInfo: config => {
    // const { id } = param2Obj(config.url)
    if (userMap['admin']) {
      const r = { ...userMap['admin'], routerMaps: AsyncRouterMap['admin'] }
      return {
        code: 200,
        'msg': '获取成功',
        data: r,
        t: new Date().getTime()
      }
    } else {
      return false
    }
  },
  logout: () => 'success'
  // getAsyncRouterMap: config => {
  //   const { token } = param2Obj(config.url)
  //   console.log(token)
  //   if (AsyncRouterMap[token]) {
  //     return AsyncRouterMap[token]
  //   } else {
  //     return false
  //   }
  // }
}
