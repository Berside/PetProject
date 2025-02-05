import React, {createContext} from 'react';
import App from './App';
import UserStore from "./store/User";
import PostStore from "./store/Post";
import { BrowserRouter } from 'react-router-dom';
import {createRoot} from 'react-dom/client'
export const Context = createContext(null)

createRoot(document.getElementById('root')).render(
    <Context.Provider value={{
        user: new UserStore(),
        posts: new PostStore(),
    }}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Context.Provider>
)