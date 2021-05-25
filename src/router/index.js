import {
  Home, ReactReduxPage, HocPage, ContextPage, ReduxPage, LoginPage,
} from '../pages'

// 常驻路由(一直可见)
export const constantRouters = [
  {
    path: '/',
    component: Home,
  },
  { path: '/login', component: LoginPage },
  {
    path: '/home',
    component: Home,
  },
]

// 用户动态路由(会根据用户权限进行筛选)
export const dynamicUserRouters = [
  {
    path: '/hoc',
    component: HocPage,
  },
  {
    path: '/context',
    component: ContextPage,
  },
  {
    path: '/redux',
    component: ReduxPage,
  },
  {
    path: '/react-redux',
    component: ReactReduxPage,
  },
]
