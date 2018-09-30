/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const superUserRouter = {
  path: '/superuser',
  component: Layout,
  name: 'SuperUser',
  redirect: 'noredirect',
  meta: {
    title: 'superUser',
    icon: 'supervise'
  },
  children: [
    {
      path: 'users',
      component: () => import('@/views/superuser/users/index'),
      name: 'Users',
      meta: { title: 'users' }
    },
    {
      path: 'roles',
      component: () => import('@/views/superuser/roles/list'),
      name: 'Roles',
      meta: { title: 'roles' }
    },
    {
      path: 'menus',
      component: () => import('@/views/superuser/menus/list'),
      name: 'Menus',
      meta: { title: 'menus' }
    },
    {
      path: 'operation_logs',
      component: () => import('@/views/superuser/OperationLogs/list'),
      name: 'OperationLogs',
      meta: { title: 'operationLogs' }
    }
  ]
}

export default superUserRouter
