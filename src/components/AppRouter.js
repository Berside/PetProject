import React, { useContext } from "react";
import {Routes, Route, Navigate} from 'react-router-dom';
import { AuthRoutes, publickRoutes } from "../routes.js";
import { Context } from "../index";
import { MAIN_ROUTE } from "../utils/consts.js";
const AppRouter = () => {
    const {user} = useContext(Context)
    return (
        <Routes>
            {user.isAuth === true && AuthRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} exact/>
            )}
            {publickRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} exact/>
            )}
            <Route path="*" element={<Navigate to={MAIN_ROUTE}/>}/>
        </Routes>
    )
}
export default AppRouter;