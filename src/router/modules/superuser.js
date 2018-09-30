/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const superUserRouter = {
  path: '/superuser',
  component: Layout,
  redirect: 'noredirect',
  name: 'SuperUser',
  meta: {
    title: '超级管理',
    icon: 'supervise'
  },
  children: [
    {
      path: 'users',
      component: () => import('@/views/superuser/users/list'),
      name: 'Users',
      meta: { title: '用户管理' }
    },
    {
      path: 'roles',
      component: () => import('@/views/superuser/roles/list'),
      name: 'Roles',
      meta: { title: '角色权限' }
    }
  ]
}

export default superUserRouter
