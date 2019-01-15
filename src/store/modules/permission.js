import { asyncRouterMap, constantRouterMap } from '@/router'
import { getRoutes } from '@/api/routes'
import component from '@/router/component'




/**
 * 递归过滤路由表，返回合适的路由表
 * @param routes 
 */
function filterRouter(routes) {
  const res = []
  
  routes.forEach(route => {
        let data = {};
        data.path = route.url;
        if(component[route.component]){
          data.component = component[route.component]
        }
        data.name = route.name;
        data.meta = {
          title:route.name,
          icon:route.icon
        }
        data.children = filterRouter(route.list);
        console.log(data)
        if(route.type != 2){
          res.push(data)
        }
        
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise((resolve,reject) => {
        getRoutes().then((response)=>{
          const data = response.data;//用户权限表
          // console.log(filterRouter(data));
          let accessedRouters
          accessedRouters = asyncRouterMap
          accessedRouters = filterRouter(data)
          accessedRouters.push(
            { path: '*', redirect: '/404', hidden: true }
          )
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        }).catch(error => {
          reject(error)
        })
        
      })
    }
  }
}

export default permission
