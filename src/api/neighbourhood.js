import request from '@/utils/request'

export function createNeighbourhood(data){
    return request({
        url:'/page/neighbourhood/create',
        method:'post',
        data
    })
}

export function deleteNeighbourhood(data){
    return request({
        url:'/page/neighbourhood/delete',
        method:'delete',
        data
    })
}

export function getNeighbourhood(params){
    return request({
        url:'/page/neighbourhood/findPage',
        method:'get',
        params
    })
}

export function getNeighbourhoodById(params){
    return request({
        url:'/page/neighbourhood/info',
        method:'get',
        params
    })
}

export function updateNeighbourhood(data){
    return request({
        url:'/page/neighbourhood/update',
        method:'put',
        data
    })
}