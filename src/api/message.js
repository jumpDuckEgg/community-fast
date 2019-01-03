import request from '@/utils/request'


// 查找留言（分页）
export function findMessage(params){
    return request({
        url:'/page/feedback/findPage',
        method:'get',
        params
    })
}

// 查找某个留言
export function findMessageById(params){
    return request({
        url:'/page/feedback/info',
        method:'get',
        params
    })
}

//修改留言
export function updateMessage(data){
    return request({
        url:'/page/feedback/update',
        method:'put',
        data
    })
}
