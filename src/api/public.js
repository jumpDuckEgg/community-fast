import request from '@/utils/request'


export function getPermission(){
    return request({
        url:'/findPermission',
        method:'get'
    })
}