import request from '@/utils/request'

export function  createMenu(data){
    return request({
        url:'/sys/menu/save',
        method:'post',
        data
    })
}

export function  updateMenu(data){
    return request({
        url:'/sys/menu/update',
        method:'post',
        data
    })
}

export function findChildren(params){
    return request({
        url:'/sys/menu/findChildren',
        method:'get',
        params
    })
}


// 获取导航菜单
export function  getNavMenu(){//个人菜单
    return request({
        url:'/sys/menu/nav',
        method:'get'
    })
}

// 获取所有菜单列表
export function  getListMenu(params){//全部菜单
    return request({
        url:'/sys/menu/list',
        method:'get',
        params
    })
}

// 获取菜单信息
export function  getMenuInfo(menuId){
    return request({
        url:`/sys/menu/info/${menuId}`,
        method:'get'
    })
}


// 删除菜单
export function  deleteMenu(menuId){
    return request({
        url:`/sys/menu/delete/${menuId}`,
        method:'post'
    })
}


