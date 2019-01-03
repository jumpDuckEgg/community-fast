import request from '@/utils/request'

export function createAdPosition(data){
    return request({
        url:'/page/ad-position/create',
        method:'post',
        data
    })
}

export function deleteAdPosition(data){
    return request({
        url:'/page/ad-position/delete',
        method:'delete',
        data
    })
}

export function getAdPosition(params){
    return request({
        url:'/page/ad-position/findPage',
        method:'get',
        params
    })
}

export function getAdPositionById(params){
    return request({
        url:'/page/ad-position/info',
        method:'get',
        params
    })
}

export function updateAdPosition(data){
    return request({
        url:'/page/ad-position/update',
        method:'put',
        data
    })
}