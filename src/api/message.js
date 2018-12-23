import request from '@/utils/request'


// 查找留言（分页）
export function findMessage(query){
    return request({
        url:'/page/feedback/findPage',
        method:'get',
        query
    })
}

// 查找某个留言
export function findMessageById(query){
    return request({
        url:'/page/feedback/info',
        method:'get',
        query
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
