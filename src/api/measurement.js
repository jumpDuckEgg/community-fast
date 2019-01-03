import request from '@/utils/request'

export function createMeasurement(data){
    return request({
        url:'/page/measurement/create',
        method:'post',
        data
    })
}

export function deleteMeasurement(data){
    return request({
        url:'/page/measurement/delete',
        method:'delete',
        data
    })
}

export function getMeasurement(params){
    return request({
        url:'/page/measurement/findPage',
        method:'get',
        params
    })
}

export function getMeasurementById(params){
    return request({
        url:'/page/measurement/info',
        method:'get',
        params
    })
}

export function updateMeasurement(data){
    return request({
        url:'/page/measurement/update',
        method:'put',
        data
    })
}