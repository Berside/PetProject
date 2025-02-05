import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        try {
            this._isAdmin = false
            this._isAuth = false
            this._user = {}
            makeAutoObservable(this)
        } catch (error) {
            console.error('Ошибка при создании UserStore:', error)
        }
    }
    setIsAdmin(bool) {
        this._isAdmin = bool
    }
    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }
    get isAdmin() {
        return this._isAdmin
    }
    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
}