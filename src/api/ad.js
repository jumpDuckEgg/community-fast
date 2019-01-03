import request from '@/utils/request'

export function createAd(data){
    return request({
        url:'/page/ad/create',
        method:'post',
        data
    })
}

export function deleteAd(data){
    return request({
        url:'/page/ad/delete',
        method:'delete',
        data
    })
}

export function getAd(params){
    return request({
        url:'/page/ad/findPage',
        method:'get',
        params
    })
}

export function getAdById(params){
    return request({
        url:'/page/ad/info',
        method:'get',
        params
    })
}

export function updateAd(data){
    return request({
        url:'/page/ad/update',
        method:'put',
        data
    })
}