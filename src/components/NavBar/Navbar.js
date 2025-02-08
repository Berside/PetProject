import React, { useContext } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Context } from "../../index";
import { NavLink } from "react-router-dom";
import { ADD_POST_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, PROFILE_ROUTE } from "../../utils/consts";
import {Button} from 'react-bootstrap';
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import './Navbar.css'
import userprof from '../../assets/IconsUser.png'
import edit from '../../assets/iconsKar.png'
import cross from '../../assets/IconsKres.png'
const Bar = observer(() => {
    const {user} = useContext(Context)
    const history = useNavigate()
    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        history(LOGIN_ROUTE)
    }
    return (
        <div className='babadyk-1'>
        <Navbar bg="dark" data-bs-theme="dark" className="a">
        <Container>
            <NavLink style={{color:'white'}} to={MAIN_ROUTE} className='bidir'>BlackWeather</NavLink>
            {user.isAuth && user.isAdmin ? (
             <Nav className="ml-auto d-flex align-items-center" style={{color:'white'}}>
                <h1 className="ml-5"> Admin mode </h1>
                <img src={edit} onClick={() => history(ADD_POST_ROUTE)} className="aaa" alt='Написать пост'/>
                <img src={userprof} onClick={() => history(PROFILE_ROUTE)} className="aaa"  alt='Ваш профиль' /> 
                <img src={cross} onClick={() => logOut()} className="aaa"  alt='Выйти' />
            </Nav>
        ) : user.isAuth ? (
            <Nav className="ml-auto d-flex align-items-center" style={{color:'white'}}>
                <img src={edit} onClick={() => history(ADD_POST_ROUTE)} className="aaa" alt='Написать пост'/>
                <img src={userprof} onClick={() => history(PROFILE_ROUTE)} className="aaa"  alt='Ваш профиль' /> 
                <img src={cross} onClick={() => logOut()} className="aaa"  alt='Выйти' />
            </Nav>
        ) : (
            <Nav className="ml-auto" style={{color:'white'}}>
                <Button variant={'outline-light'} onClick={() => history(LOGIN_ROUTE)}> Авторизация </Button>
            </Nav>
        )}
        </Container>
      </Navbar>
      </div>
    )
})
export default Bar;