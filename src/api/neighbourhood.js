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

export function getNeighbourhood(query){
    return request({
        url:'/page/neighbourhood/findPage',
        method:'get',
        query
    })
}

export function getNeighbourhoodById(query){
    return request({
        url:'/page/neighbourhood/info',
        method:'get',
        query
    })
}

export function updateNeighbourhood(data){
    return request({
        url:'/page/neighbourhood/update',
        method:'put',
        data
    })
}