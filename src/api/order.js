import request from '@/utils/request'

export function createOrder(data){
    return request({
        url:'/page/order/create',
        method:'post',
        data
    })
}

export function deleteOrder(data){
    return request({
        url:'/page/order/delete',
        method:'delete',
        data
    })
}

export function getOrder(params){
    return request({
        url:'/page/order/findPage',
        method:'get',
        params
    })
}

export function getOrderById(params){
    return request({
        url:'/page/order/info',
        method:'get',
        params
    })
}

export function updateOrder(data){
    return request({
        url:'/page/order/update',
        method:'put',
        data
    })
}