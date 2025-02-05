    import {$authHost, $host} from "./index";
    export const BlogCreate = async (title, description, selectedFile) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        if (!token) {
        throw new Error('Токен не найден в локальном хранилище');
        }
        if(selectedFile) {
            console.log(selectedFile);
            formData.append('images', selectedFile);
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



    const BUCKET_NAME = "blogs-data"