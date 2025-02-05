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
    const response = await $host.patch('v1/user/changePassword', 
      { old_password, new_password },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const bab = localStorage.getItem('token');
    console.log(bab);
    return response.data.message;
  } catch (error) {
    console.error('Ошибка при изменении пароля:', error.response?.data || error.message);
    throw error;
  }
};

export const ChangePhoto = async (image) => {

  const formData = new FormData();
  if(image) {
      console.log(image);
      formData.append('pfp', image);
      console.log(formData.get('pfp'));
  }
  
  try{
      const response = await $authHost.patch('v1/user/change_pfp', formData);
      console.log(formData);
      console.log('Успешный ответ:', response.data);
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
    const {data} = await $authHost.get('v1/user/current')
    localStorage.setItem('id', data.data.id)
    return data;
}


export const FetchUser = async (UserId) => {
  const {data} = await $host.get('v1/user/getOne', {
      params: {
          id: UserId  
      }
  }
)
  return data.data;
}
