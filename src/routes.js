import addpost from './pages/addpost/addpost'
import Auth from './pages/auth/auth'
import PostPage from './pages/PostPage/PostPage'
import Home from './pages/home/Home'
import ProfileOne from './pages/ProfileOne/profileOne'
import UserProfile from './pages/UserProfile/UserProfile'
import {PROFILE_ROUTE, POST_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, MAIN_ROUTE, ADD_POST_ROUTE } from './utils/consts'

export const AuthRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: ProfileOne
    },
    {
        path: ADD_POST_ROUTE,
        Component: addpost
    }
]

export const publickRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Home
    },
    {
        path: PROFILE_ROUTE + '/:id',
        Component: UserProfile
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: POST_ROUTE + '/:id',
        Component: PostPage
    },
]