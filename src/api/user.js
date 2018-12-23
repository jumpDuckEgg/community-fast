import request from '@/utils/request'


export function getUserList(params){
    return request({
        url: '/sys/user/list',
        method: 'get',
        params
    })
}

export function getUserInfo(userId){
    return request({
        url: `/sys/user/info/${userId}`,
        method: 'get'
    })
}


export function deleteUser(data){
    return request({
        url: '/sys/user/delete',
        method: 'post',
        data
    })
}

export function modifyPassWord(data){
    return request({
        url: '/sys/user/password',
        method: 'post',
        data
    })
}

export function resetPassWord(params){
    return request({
        url: '/sys/user/resetPassword',
        method: 'get',
        params
    })
}

export function createUser(data){
    return request({
        url: '/sys/user/save',
        method: 'post',
        data 
    })
}

export function updateUser(data){
    return request({
        url: '/sys/user/update',
        method: 'post',
        data
    })
}