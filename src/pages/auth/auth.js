import React, {useContext, useState} from 'react';
import {Container, Form} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../../utils/consts";
import {observer} from "mobx-react-lite";
import './auth.css';
import { login, registration } from '../../http/userAPI';
import { Context } from '../../index.js';

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const history = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const click = async () => {
      try {
          let data;
          if (isLogin) {
              data = await login(email, password);
              user.setUser(user)
              user.setIsAuth(true)
              history(MAIN_ROUTE)
          } else {
              data = await registration(username, email, password);
              try {
                alert('Вы успешно зарегистрированы!')
              } catch (e) {
                alert(e.response.data.message)
              }
          }
      } catch (e) {
          alert(e.response.data.message)
      }
    }

    return (
        <div className='babadyk'>
        <Container className="d-flex justify-content-center align-items-center" style={{height: window.innerHeight - 54}}>
          <Card className="auth-form-card">
            <h2 className="auth-form-title m-auto text-light">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
            <Form className="auth-form-control d-flex flex-column">
                    {!isLogin && (
                  <Form.Control
                    className="auth-form-input auth-form-input"
                    placeholder="Введите ваш Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                )}
              <Form.Control
                className="auth-form-input auth-form-input"
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control
                className="auth-form-input auth-form-password-input"
                placeholder="Введите ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
              <Row className="auth-form-row d-flex justify-content-between">
              <Button 
                  className="auth-form-button"
                  variant={"outline-light"}
                  onClick={click}
                >
                  {isLogin ? 'Войти' : 'Регистрация'}
                </Button>
                <div className="d-flex align-items-center justify-content-center">
                {isLogin ? (
                    <div className="text-light">Нет аккаунта? <NavLink className="auth-form-link text-light" to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink></div>
                ) : (
                    <div className="text-light">Есть аккаунт? <NavLink className="auth-form-link text-light" to={LOGIN_ROUTE}>Войдите!</NavLink></div>
                )}
                </div>
              </Row>
            </Form>
          </Card>
        </Container>
        </div>
      )
    });

export default Auth;



