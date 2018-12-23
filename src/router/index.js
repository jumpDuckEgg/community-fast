import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
// import Layout from '../views/layout/Layout'
// const Layout = () => import('../views/layout/Layout');
// const Login  = () => import('@/views/login/index');
// const Page404 = () => import('@/views/404');
// const Dashboard = () => import('@/views/dashboard/index');
// const Table = () => import('@/views/table/index');
// const Tree = () => import('@/views/tree/index');
// const User = () => import('@/views/user/index');
// const Menu = () => import('@/views/menu/index');
// const Role = () => import('@/views/Role/index');
// const Form = () => import('@/views/form/index');
// const FileConfig = () => import('@/views/file/index');
import component from './component'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: component.Login, hidden: true },
  { path: '/404', component: component.Page404, hidden: true },

  {
    path: '/',
    component: component.Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: component.Dashboard
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/example',
    component: component.Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: component.Table,
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: component.Tree,
        meta: { title: 'Tree', icon: 'tree', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/user',
    component: component.Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: component.User,
        meta: { title: 'User', icon: 'user' }
      }
    ]
  },
  {
    path: '/menu',
    component: component.Layout,
    meta: { title: 'Menu', icon: 'menu' },
    children: [
      {
        path: 'index',
        name: 'Menu',
        component: component.Menu,
        meta: { title: 'Menu', icon: 'menu' }
      }
    ]
  },
  {
    path: '/role',
    component: component.Layout,
    meta: { title: 'Role', icon: 'role' },
    children: [
      {
        path: 'index',
        name: 'Role',
        component: component.Role,
        meta: { title: 'Role', icon: 'role' }
      }
    ]
  },
  {
    path: '/file',
    component: component.Layout,
    meta: { title: 'File', icon: 'file' },
    children: [
      {
        path: 'index',
        name: 'File',
        component: component.FileConfig,
        meta: { title: 'File', icon: 'file' }
      }
    ]
  },
  {
    path: '/message',
    component: component.Layout,
    meta: { title: 'Message', icon: 'message' },
    children: [
      {
        path: 'index',
        name: 'Message',
        component: component.Message,
        meta: { title: 'Message', icon: 'message' }
      }
    ]
  },
  {
    path: '/form',
    component: component.Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: component.Form,
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: component.Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [  
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: component.Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
