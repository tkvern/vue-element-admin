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
      name: 'UsersIndex',
      meta: { title: 'users' }
    },
    {
      path: 'roles',
      component: () => import('@/views/superuser/roles/index'),
      name: 'RolesIndex',
      meta: { title: 'roles' }
    },
    {
      path: 'menus',
      component: () => import('@/views/superuser/menus/index'),
      name: 'MenusIndex',
      meta: { title: 'menus' }
    },
    {
      path: 'operation_logs',
      component: () => import('@/views/superuser/operationLogs/index'),
      name: 'OperationLogsIndex',
      meta: { title: 'operationLogs' }
    }
  ]
}

export default superUserRouter
