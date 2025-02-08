import {$authHost, $host} from "./index";
export const CommentCreate = async (text, blog_id) => {
    const token = localStorage.getItem('token');
    if (!token) {
    throw new Error('Токен не найден в локальном хранилище');
    }
    try {
        const data = await $authHost.post('v1/comment/create', { text, blog_id });
    return data.message;
    } catch (error) {
    throw error;
    }
}

export const DeleteComment = async (comment_id) => {
    try {
        const {data} = await $authHost.delete('v1/comment/delete', {
            params: {
                comment_id: comment_id
            }
        })
        return data;   
    } catch (error) {
        console.log(error)
    }
}