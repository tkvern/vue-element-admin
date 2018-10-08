/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const superUserRouter = {
  path: '/syscharts',
  component: Layout,
  redirect: 'noredirect',
  name: 'SysCharts',
  meta: {
    title: 'sysCharts',
    icon: 'supervise'
  },
  children: [
    {
      path: 'interface_charts',
      component: () => import('@/views/syscharts/interfaceCharts/index'),
      name: 'InterfaceCharts',
      meta: { title: 'interfaceCharts' }
    },
    {
      path: 'parameter_charts',
      component: () => import('@/views/syscharts/parameterCharts/index'),
      name: 'ParameterCharts',
      meta: { title: 'parameterCharts' }
    },
    {
      path: 'user_charts',
      component: () => import('@/views/syscharts/userCharts/index'),
      name: 'UserCharts',
      meta: { title: 'userCharts' }
    }
  ]
}

export default superUserRouter
