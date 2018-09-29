import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const AsyncRouterMap = {
  admin: [
    {
      id: 1,
      path: '/nested',
      component: '',
      redirect: '/nested/menu1/menu1-1',
      name: 'Nested',
      meta: {
        title: 'nested',
        icon: 'nested'
      },
      parent_id: 0
    },
    {
      id: 2,
      path: 'menu1',
      component: './src/views/nested/menu1/index.vue',
      redirect: '',
      name: 'Menu1',
      meta: {
        title: 'menu1',
        icon: ''
      },
      parentId: 1
    },
    {
      id: 3,
      path: 'menu2',
      component: '/src/views/nested/menu2/index',
      redirect: '',
      name: 'Menu2',
      meta: {
        title: 'menu2',
        icon: ''
      },
      parentId: 1
    },
    {
      id: 4,
      path: 'menu1-1',
      component: '/src/views/nested/menu1/menu1-1',
      redirect: '',
      name: 'Menu1-1',
      meta: {
        title: 'menu1-1',
        icon: ''
      },
      parentId: 2
    },
    {
      id: 5,
      path: 'menu1-3',
      component: '/src/views/nested/menu1/menu1-3',
      redirect: '',
      name: 'Menu1-3',
      meta: {
        title: 'menu1-3',
        icon: ''
      },
      parentId: 2
    }
  ],
  editor: [
    {
      id: 1,
      path: '/nested',
      component: '',
      redirect: '/nested/menu1/menu1-1',
      name: 'isEditorNested',
      meta: {
        title: 'nested',
        icon: 'nested'
      },
      parent_id: 0
    },
    {
      id: 2,
      path: 'menu1',
      component: '/src/views/nested/menu1/index',
      redirect: '/nested/menu1/menu1-1',
      name: 'Menu1 Editor',
      meta: {
        title: 'menu1',
        icon: ''
      },
      parentId: 1
    },
    {
      id: 3,
      path: 'menu2',
      component: '/src/views/nested/menu2/index',
      redirect: '',
      name: 'Menu2 Editor',
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
    const { username } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const { id } = param2Obj(config.url)
    if (userMap[id]) {
      const r = { ...userMap[id], routerMaps: AsyncRouterMap[id] }
      return r
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
