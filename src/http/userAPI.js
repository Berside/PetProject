import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";
export const registration = async (username, email, password) => {
    try {
      const {data} = await $host.post('v1/auth/register', {username, email, password})
      localStorage.setItem('message', data.message)
      return data.message;
    } catch (error) {
      throw error;
    }
  }

export const login = async (email, password) => {
    const {data} = await $host.post('v1/auth/login', {email, password})
    localStorage.setItem('token', data.access_token)
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден в локальном хранилище');
    }
    return jwtDecode(data.access_token)
}

export const changePassword = async (old_password, new_password) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден в локальном хранилище');
    }
    const response = await $authHost.patch('v1/user/changePassword', { old_password, new_password });
    const bab = localStorage.getItem('token');
    return response.data.message;
  } catch (error) {
    console.error('Ошибка при изменении пароля:', error.response?.data || error.message);
    throw error;
  }
};

export const ChangePhoto = async (image) => {

  const formData = new FormData();
  if(image) {
      formData.append('pfp', image);
  }
  
  try{
      const response = await $authHost.patch('v1/user/changePfp', formData);
      return response;
  } catch (error) {
      if (error.response) {
          console.error('Ошибка от сервера:');
          console.error('Статус:', error.response.status);
          console.error('Данные ответа:', error.response.data);
          console.error('Заголовки:', error.response.headers);
      } else if (error.request) {
          console.error('Ошибка запроса:');
          console.error('Запрос:', error.request);
      } else {
          console.error('Другая ошибка:');
          console.error('Сообщение:', error.message);
      }
      
      throw error;
  }
};


export const check = async () => {
  try {
    const { data } = await $authHost.get('v1/user/current');
    localStorage.setItem('id', data.data.id);
    return data;
  } catch (error) {
    console.error('Ошибка при проверке пользователя:', error);
  }
};

export const getLikeBlogs = async () => {
  const {data} = await $authHost.get('v1/user/getLikedBlogs')
  return data.data;
}

export const FetchUser = async (UserId) => {
  try {
    const {data} = await $host.get('v1/user/getOne', {
      params: {
          id: UserId  
          }
      }
    )
    return data.data;
  } catch (error) {
    console.error('Ошибка при проверке пользователя:', error);
  }
}

export const GETadmin = async (Code) => {
  try{
    const { data } = await $authHost.patch(`v1/user/getAdmin?code=${Code}`);
    return data;
  } catch(error) {
    console.log(error)
  }
}