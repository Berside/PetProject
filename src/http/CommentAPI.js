import {$authHost, $host} from "./index";
export const CommentCreate = async (text, blog_id) => {
    const token = localStorage.getItem('token');
    if (!token) {
    throw new Error('Токен не найден в локальном хранилище');
    }
    try {
        const data = await $host.post('v1/comment/create', 
            { text, blog_id },
            {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            }
        );
    return data.message;
    } catch (error) {
    throw error;
    }
}