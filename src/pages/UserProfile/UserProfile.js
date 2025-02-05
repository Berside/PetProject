import { observer } from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, CardImg, Col, Container, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { Context } from '../../index';
import { changePassword } from '../../http/userAPI';
import { FetchUser } from '../../http/userAPI';
import { ChangePhoto } from '../../http/userAPI';
import {useParams} from 'react-router-dom'
import userIcon from '../../assets/user.png'
import './UserProfile.css';
const UserProfile = observer(() => {
    const bucketName = process.env.NEXT_PUBLIC_YANDEX_BUCKET_NAME || 'blogs-data/';
    const [user, setUser] = useState({ info: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await FetchUser(id);
                setUser(userData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    const date = new Date(user.created_at);
    const formattedDate = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
    });
    const imageUrl = `https://storage.yandexcloud.net/${bucketName}${user.pfp_path}`;
    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <>
          <div className='babka'>
        <Container className="py-4">
          <Row className="mb-4">
            <Col>
                <h1 className="text-center">{user.username ? 
                `Профиль пользователя ${user.username}` : 
                'Профиль пользователя'}</h1>
            </Col>
          </Row>
            <Card className='babkovich'> 
                    <CardImg src={user?.pfp_path ? `https://storage.yandexcloud.net/${bucketName}${user.pfp_path}` : userIcon}  className='babkovichLi'></CardImg>
            </Card>
          <Row className='bab'>
            <Col md={4}>    
              <Card className="mb-3">
                <Card.Body className="text-center py-3">
                <h5>Email: {user.email || 'Email'}</h5>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body className="text-center py-3">
                <h5>ID: {user.id || 'id'}</h5>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body className="text-center py-3">
                <h5>Role: {user.role || 'Role'}</h5>
                </Card.Body>
              </Card>
            </Col>
    
            <Col md={4}>
            <Card
              className="profile-card flex-column align-items-center justify-content-around"
              style={{
                  backgroundColor: 'rgba(37, 37, 37, 0)',
                  border: '3px solid rgba(37, 37, 37, 1)',
                  WebkitBackdropFilter: 'blur(5px)',
                  backdropFilter: 'blur(5px)',
                  overflow: 'hidden'
              }}>
                <Card.Body className="text-center pt-4">
                <h3>{formattedDate ? 
                    `Создан: ${formattedDate}` : 
                    'Создан'}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        </div>
            </>
      );
})
export default UserProfile;