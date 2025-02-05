import { observer } from 'mobx-react-lite';
import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, CardImg, Col, Container, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Context } from '../../index';
import './profileOne.css';
import { changePassword } from '../../http/userAPI';
import { FetchUser } from '../../http/userAPI';
import { ChangePhoto } from '../../http/userAPI';
const ProfileOne = observer(() => {
  const bucketName = process.env.NEXT_PUBLIC_YANDEX_BUCKET_NAME || 'blogs-data/';
  const [OLD, setOLD] = useState('')
  const [NEW, setNEW] = useState('')

      const CLICKED = async () => {
        try {
            let data;
            data = await changePassword(OLD, NEW)
            try {
              alert('Вы успешно поменяли пароль!')
              handleClose();
            } catch (e) {
              alert(e.response.message)
            }
        } catch (e) {
            alert(e.response.message)
        }
      }

      const [selectedFile, setSelectedFile] = useState(null);

      async function handleImageClick() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
      
        // Создаем промис для ожидания выбора файла
        const waitForFile = new Promise((resolve) => {
          fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedFile(file);
              const reader = new FileReader();
              reader.readAsDataURL(file);
              resolve(file); // Разрешаем промис после установки состояния
            }
          };
        });
      
        fileInput.click();
      
        try {
          const selectedFile = await waitForFile;
          console.log(selectedFile)
          await clicked(selectedFile);
        } catch (error) {
          alert(error.response?.message || 'Произошла ошибка при загрузке файла');
        }
      }
    
      async function clicked(isd) {
        try {
          let data;
          console.log(isd);
          data = await ChangePhoto(isd);
          console.log(data)
        } catch (e) {
          throw e; // Пробрасываем ошибку наверх для обработки
        }
      }

  const id = localStorage.getItem('id');

      const [user, setUSER] = useState({ info: [] });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const date = new Date(user.created_at);
      const formattedDate = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
      });
      const imageUrl = `https://storage.yandexcloud.net/${bucketName}${user.pfp_path}`;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const USERDATA1 = await FetchUser(id);
                setUSER(USERDATA1);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    console.log(user);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
                  <CardImg src={imageUrl} className='babkovichLi'></CardImg>
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
                <Button 
                   variant='outline-light'
                  size="sm"
                  className="mt-2 px-5"
                  onClick={handleShow}
                >
                  Поменять пароль
                </Button>
                <Button 
                   variant='outline-light'
                  size="sm"
                  className="mt-2 px-5"
                  onClick={handleImageClick}
                >
                  Поменять аватарку
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      </div>
            <Modal show={show} onHide={handleClose} className='abg'>
            <Modal.Header closeButton>
              <Modal.Title>Хотите поменять пароль?</Modal.Title>
            </Modal.Header>
            <Modal.Body className='abg'>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label className='pick'>Введите текущий пароль</Form.Label>
                  <Form.Control
                    value={OLD} 
                    onChange={(e) => setOLD(e.target.value)}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label className='pick'>Введите новый пароль</Form.Label>
                  <Form.Control
                    value={NEW} 
                    onChange={(e) => setNEW(e.target.value)}
                    autoFocus
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={CLICKED} >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          </>
    );
  });
  
  export default ProfileOne;