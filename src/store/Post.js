import { makeAutoObservable } from "mobx";
import {$authHost, $host} from "../http/index";
export default class PostStore {
    constructor() {
      // Используем один массив для хранения всех постов
      this.posts = [];
      // Добавляем состояние загрузки
      this.isLoading = false;
      this.error = null;
      makeAutoObservable(this);
    }
  
    // Метод для получения постов из API
    async fetchPosts(params = {}) {
      this.isLoading = true;
      this.error = null;
  
      try {
        const {response} = await $host.get('v1/blog/getMany');
  
        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
  
        const data = await response.json();
  
        // Обновляем состояние с данными из ответа
        this.posts = data.data.map(post => ({
          ...post,
          owner: post.owner
        }));
        
        return data.message; // Возвращаем сообщение об успехе
      } catch (err) {
        this.error = err.message || 'Произошла ошибка при получении данных';
        throw err; // Перебрасываем ошибку дальше
      } finally {
        this.isLoading = false;
      }
    }
  
    // Геттеры для доступа к данным
    get allPosts() {
      return this.posts;
    }
  
    get isLoadingPosts() {
      return this.isLoading;
    }
  
    get hasError() {
      return !!this.error;
    }
  }