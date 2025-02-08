    import {$authHost, $host} from "./index";
    export const BlogCreate = async (title, description, selectedFile) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        if (!token) {
        throw new Error('Токен не найден в локальном хранилище');
        }
        if(selectedFile) {
            for (const file of selectedFile) {
                formData.append('images', file);
            }
        }
        try {
            const data = await $authHost.post('v1/blog/create', formData, {
                params: {
                    title: title,
                    description: description
                }
            }
            );  
        return data.message;
        } catch (error) {
        throw error;
        }
    }


    export const fetchPOSTS = async () => {
        const {data} = await $host.get('v1/blog/getMany')
        return data.data
    }

    export const FetchPostComments = async (postID) => {
        const {data} = await $host.get('v1/blog/getComments', {
            params: {
                blog_id: postID
            }
        }
        )
        return data.data
    }
    export const FetchPost = async (postID) => {
        const {data} = await $host.get('v1/blog/getOne', {
            params: {
                id: postID  
            }
        }
    )
        return data.data;
    }

    export const fetchUserPOSTS = async (UserId) => {
        const {data} = await $host.get('v1/blog/getMany', {
            params: {
                owner_id: UserId
            }
        })
        return data.data
    }


    export const DeleteBlog = async (blog_id) => {
        try {
            const {data} = await $authHost.delete('v1/blog/delete', {
                params: {
                    blog_id: blog_id
                }
            })
            return data;   
        } catch (error) {
            console.log(error)
        }
    }

    export const AddLikePost = async (blog_id) => {
        try {
            const {data} = await $authHost.patch(`v1/blog/toggleLike?blog_id=${blog_id}`)
            return data;
        } catch (error) {
            console.log(error)
        }
    }
    export const likedBy = async (blog_id) => {
        const {data} = await $host.get('v1/blog/likedBy', {
            params: {
                blog_id: blog_id
            }
        })
        return data.data
    }