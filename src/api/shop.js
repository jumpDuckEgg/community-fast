import request from '@/utils/request'

export function createShop(data){
    return request({
        url:'/page/shop/create',
        method:'post',
        data
    })
}

export function deleteShop(data){
    return request({
        url:'/page/shop/delete',
        method:'delete',
        data
    })
}

export function getShop(params){
    return request({
        url:'/page/shop/findPage',
        method:'get',
        params
    })
}

export function getShopById(params){
    return request({
        url:'/page/shop/info',
        method:'get',
        params
    })
}

export function updateShop(data){
    return request({
        url:'/page/shop/update',
        method:'put',
        data
    })
}


export function getOwnShops(params){
    return request({
        url:'/page/shop/findUserShop',
        method:'get',
        params
    })
}