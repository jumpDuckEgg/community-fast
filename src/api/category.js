import request from '@/utils/request'

export function createCategory(data){
    return request({
        url:'/page/category/create',
        method:'post',
        data
    })
}

export function deleteCategory(data){
    return request({
        url:'/page/category/delete',
        method:'delete',
        data
    })
}

export function getCategory(params){
    return request({
        url:'/page/category/findPage',
        method:'get',
        params
    })
}

export function getCategoryById(params){
    return request({
        url:'/page/category/info',
        method:'get',
        params
    })
}

export function updateCategory(data){
    return request({
        url:'/page/category/update',
        method:'put',
        data
    })
}