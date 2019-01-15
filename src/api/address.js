import request from '@/utils/request'

export function createAddress(data){
    return request({
        url:'/page/user-address/create',
        method:'post',
        data
    })
}

export function deleteAddress(data){
    return request({
        url:'/page/user-address/delete',
        method:'delete',
        data
    })
}

export function getAddress(params){
    return request({
        url:'/page/user-address/findPage',
        method:'get',
        params
    })
}

export function getAddressById(params){
    return request({
        url:'/page/user-address/info',
        method:'get',
        params
    })
}

export function updateAddress(data){
    return request({
        url:'/page/user-address/update',
        method:'put',
        data
    })
}