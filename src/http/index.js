import axios from "axios";

const $host = axios.create({
    baseURL: 'http://89.169.168.203:7100/'
})

const $authHost = axios.create({
    baseURL: 'http://89.169.168.203:7100/'
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}