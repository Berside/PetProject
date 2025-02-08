import { makeAutoObservable } from "mobx";
import {$authHost, $host} from "../http/index";
export default class PostStore {
    constructor() {
      this.posts = [];
      this.isLoading = false;
      this.error = null;
      makeAutoObservable(this);
    }
  
    async fetchPosts(params = {}) {
      this.isLoading = true;
      this.error = null;
  
      try {
        const {response} = await $host.get('v1/blog/getMany');
  
        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
  
        const data = await response.json();
  
        this.posts = data.data.map(post => ({
          ...post,
          owner: post.owner
        }));
        
        return data.message; 
      } catch (err) {
        this.error = err.message || 'Произошла ошибка при получении данных';
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  
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