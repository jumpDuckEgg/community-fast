import request from '@/utils/request'

export function createBoard(data){
    return request({
        url:'/page/bulletin-board/create',
        method:'post',
        data
    })
}

export function deleteBoard(data){
    return request({
        url:'/page/bulletin-board/delete',
        method:'delete',
        data
    })
}

export function getBoard(params){
    return request({
        url:'/page/bulletin-board/findPage',
        method:'get',
        params
    })
}

export function getBoardById(params){
    return request({
        url:'/page/bulletin-board/info',
        method:'get',
        params
    })
}

export function updateBoard(data){
    return request({
        url:'/page/bulletin-board/update',
        method:'put',
        data
    })
}