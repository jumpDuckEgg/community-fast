import request from '@/utils/request'

export function createGoodsShop(data){
    return request({
        url:'/page/goods-shop/create',
        method:'post',
        data
    })
}

export function deleteGoodsShop(data){
    return request({
        url:'/page/goods-shop/delete',
        method:'delete',
        data
    })
}

export function getGoodsShop(params){
    return request({
        url:'/page/goods-shop/findPage',
        method:'get',
        params
    })
}

export function getGoodsShopById(params){
    return request({
        url:'/page/goods-shop/info',
        method:'get',
        params
    })
}

export function updateGoodsShop(data){
    return request({
        url:'/page/goods-shop/update',
        method:'put',
        data
    })
}