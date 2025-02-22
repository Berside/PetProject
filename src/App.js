import React, {useContext, useEffect, useState} from 'react';
import AppRouter from './components/AppRouter';
import Bar from './components/NavBar/Navbar';
import { observer } from 'mobx-react-lite';
import {check} from "./http/userAPI";
import {Spinner} from "react-bootstrap";
import { Context } from './index';

const App = observer(() => {
  const {user} = useContext(Context);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  useEffect(() => {
    const initializeAuth = async () => {
      if ( token !== null ) {
        try {
          const response = await check();
          console.log(response.data.role);
          if (response?.data) {
            user.setUser(response.data);
            user.setIsAuth(true);
          }
          if (response.data.role === 'admin') {
            user.setIsAdmin(true);
          }
        } catch (error) {
          console.error('Ошибка при проверке пользователя:', error);
          user.setIsAuth(false); 
        } finally {
          setLoading(false);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []); 

  if (loading) {
    return <Spinner animation="grow"/>;
  }

  return (
    <div>
      <Bar/>
      <AppRouter/>
    </div>
  );
});

export default App;