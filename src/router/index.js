import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

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
  // {
  //   path: '/user',
  //   component: component.Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'User',
  //       component: component.User,
  //       meta: { title: 'User', icon: 'user' }
  //     }
  //   ]
  // },
  // {
  //   path: '/menu',
  //   component: component.Layout,
  //   meta: { title: 'Menu', icon: 'menu' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Menu',
  //       component: component.Menu,
  //       meta: { title: 'Menu', icon: 'menu' }
  //     }
  //   ]
  // },
  // {
  //   path: '/role',
  //   component: component.Layout,
  //   meta: { title: 'Role', icon: 'role' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Role',
  //       component: component.Role,
  //       meta: { title: 'Role', icon: 'role' }
  //     }
  //   ]
  // },
  // {
  //   path: '/file',
  //   component: component.Layout,
  //   meta: { title: 'File', icon: 'file' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'File',
  //       component: component.FileConfig,
  //       meta: { title: 'File', icon: 'file' }
  //     }
  //   ]
  // },
  // {
  //   path: '/message',
  //   component: component.Layout,
  //   meta: { title: 'Message', icon: 'message' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Message',
  //       component: component.Message,
  //       meta: { title: 'Message', icon: 'message' }
  //     }
  //   ]
  // },
  // {
  //   path: '/neighbourhood',
  //   component: component.Layout,
  //   meta: { title: 'neighbourhood', icon: 'neighbourhood' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'neighbourhood',
  //       component: component.Neighbourhood,
  //       meta: { title: 'neighbourhood', icon: 'neighbourhood' }
  //     }
  //   ]
  // },
  // {
  //   path: '/ad',
  //   component: component.Layout,
  //   meta: { title: 'ad', icon: 'ad' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'ad',
  //       component: component.Ad,
  //       meta: { title: 'ad', icon: 'ad' }
  //     }
  //   ]
  // },
  // {
  //   path: '/adPosition',
  //   component: component.Layout,
  //   meta: { title: 'adPosition', icon: 'position' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'adPosition',
  //       component: component.AdPosition,
  //       meta: { title: 'adPosition', icon: 'position' }
  //     }
  //   ]
  // },
  // {
  //   path: '/board',
  //   component: component.Layout,
  //   meta: { title: 'board', icon: 'board' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'board',
  //       component: component.Board,
  //       meta: { title: 'board', icon: 'board' }
  //     }
  //   ]
  // },
  // {
  //   path: '/measurement',
  //   component: component.Layout,
  //   meta: { title: 'measurement', icon: 'measurement' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'measurement',
  //       component: component.Measurement,
  //       meta: { title: 'measurement', icon: 'measurement' }
  //     }
  //   ]
  // },
  // {
  //   path: '/log',
  //   component: component.Layout,
  //   meta: { title: 'log', icon: 'log' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'log',
  //       component: component.Log,
  //       meta: { title: 'log', icon: 'log' }
  //     }
  //   ]
  // },
  // {
  //   path: '/region',
  //   component: component.Layout,
  //   meta: { title: 'region', icon: 'region' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'region',
  //       component: component.Region,
  //       meta: { title: 'region', icon: 'region' }
  //     }
  //   ]
  // },
  // {
  //   path: '/category',
  //   component: component.Layout,
  //   meta: { title: 'category', icon: 'category' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'category',
  //       component: component.Category,
  //       meta: { title: 'category', icon: 'category' }
  //     }
  //   ]
  // },
  // {
  //   path: '/address',
  //   component: component.Layout,
  //   meta: { title: 'address', icon: 'address' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'address',
  //       component: component.Address,
  //       meta: { title: 'address', icon: 'address' }
  //     }
  //   ]
  // },
  // {
  //   path: '/shop',
  //   component: component.Layout,
  //   meta: { title: 'shop', icon: 'shop' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'shop',
  //       component: component.Shop,
  //       meta: { title: 'shop', icon: 'shop' }
  //     }
  //   ]
  // },
  // {
  //   path: '/goods',
  //   component: component.Layout,
  //   meta: { title: 'goods', icon: 'goods' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'goods',
  //       component: component.Goods,
  //       meta: { title: 'goods', icon: 'goods' }
  //     }
  //   ]
  // },
  // {
  //   path: '/goodsShop',
  //   component: component.Layout,
  //   meta: { title: 'goodsShop', icon: 'goodsShop' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'goodsShop',
  //       component: component.GoodsShop,
  //       meta: { title: 'goodsShop', icon: 'goodsShop' }
  //     }
  //   ]
  // },
  // {
  //   path: '/order',
  //   component: component.Layout,
  //   meta: { title: 'order', icon: 'order' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'order',
  //       component: component.Order,
  //       meta: { title: 'order', icon: 'order' }
  //     }
  //   ]
  // },
  // {
  //   path: '/orderDetail',
  //   component: component.Layout,
  //   meta: { title: 'orderDetail', icon: 'orderDetail' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'orderDetail',
  //       component: component.OrderDetail,
  //       meta: { title: 'orderDetail', icon: 'orderDetail' }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
