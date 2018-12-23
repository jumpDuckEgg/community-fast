import request from '@/utils/request'

export function deleteRole(data){
    return request({
        url:'/sys/role/delete',
        method:'post',
        data
    })
}

export function getRoleList(params){
    return request({
        url:'/sys/role/list',
        method:'get',
        params
    })
}

export function createRole(data){
    return request({
        url:'/sys/role/save',
        method:'post',
        data
    })
}

export function updateRole(data){
    return request({
        url:'/sys/role/update',
        method:'post',
        data
    })
}


export function getRoleInfo(roleId){
    return request({
        url:`/sys/role/info/${roleId}`,
        method:'get'
    })
}