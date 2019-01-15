import request from '@/utils/request'

export function createGoods(data){
    return request({
        url:'/page/goods/create',
        method:'post',
        data
    })
}

export function deleteGoods(data){
    return request({
        url:'/page/goods/delete',
        method:'delete',
        data
    })
}

export function getGoods(params){
    return request({
        url:'/page/goods/findPage',
        method:'get',
        params
    })
}

export function getGoodsById(params){
    return request({
        url:'/page/goods/info',
        method:'get',
        params
    })
}

export function updateGoods(data){
    return request({
        url:'/page/goods/update',
        method:'put',
        data
    })
}