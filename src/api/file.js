import request from '@/utils/request'

export function getConfig(){
    return request({
        url:'/sys/oss/config',
        method:'get'
    })
}

export function deleteOss(data){
    return request({
        url:'/sys/oss/delete',
        method:'post',
        data
    })
}

export function saveConfig(data){
    return request({
        url:'/sys/oss/saveConfig',
        method:'post',
        data
    })
}

export function uploadFile(data){
    return request({
        url:'/sys/oss/upload',
        method:'post',
        data
    })
}