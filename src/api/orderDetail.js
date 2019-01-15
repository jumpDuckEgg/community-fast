import request from '@/utils/request'

export function createOrderDetail(data){
    return request({
        url:'/page/order-detail/create',
        method:'post',
        data
    })
}

export function deleteOrderDetail(data){
    return request({
        url:'/page/order-detail/delete',
        method:'delete',
        data
    })
}

export function getOrderDetail(params){
    return request({
        url:'/page/order-detail/findPage',
        method:'get',
        params
    })
}

export function getOrderDetailById(params){
    return request({
        url:'/page/order-detail/info',
        method:'get',
        params
    })
}

export function updateOrderDetail(data){
    return request({
        url:'/page/order-detail/update',
        method:'put',
        data
    })
}