import request from '@/utils/request'

export function createRegion(data){
    return request({
        url:'/page/region/create',
        method:'post',
        data
    })
}

export function deleteRegion(data){
    return request({
        url:'/page/region/delete',
        method:'delete',
        data
    })
}

export function getRegion(params){
    return request({
        url:'/page/region/findPage',
        method:'get',
        params
    })
}

export function getRegionById(params){
    return request({
        url:'/page/region/info',
        method:'get',
        params
    })
}

export function updateRegion(data){
    return request({
        url:'/page/region/update',
        method:'put',
        data
    })
}