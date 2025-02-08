import { observer } from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {Button, Card, CardImg, CardTitle, Col, Container, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './profileOne.css';
import { changePassword, getLikeBlogs,ChangePhoto,FetchUser} from '../../http/userAPI';
import { fetchUserPOSTS } from '../../http/blogAPI';
import userIcon from '../../assets/user.png'
import { POST_ROUTE } from '../../utils/consts';
import {useNavigate} from "react-router-dom";
const ProfileOne = observer(() => {
  const bucketName = process.env.NEXT_PUBLIC_YANDEX_BUCKET_NAME || 'blogs-data/';
  const [OLD, setOLD] = useState('')
  const [NEW, setNEW] = useState('')
  const history = useNavigate()
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

        const waitForFile = new Promise((resolve) => {
          fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedFile(file);
              const reader = new FileReader();
              reader.readAsDataURL(file);
              resolve(file); 
            }
          };
        });
      
        fileInput.click();
      
        try {
          const selectedFile = await waitForFile;
          await clicked(selectedFile);
        } catch (error) {
          alert(error.response?.message || 'Произошла ошибка при загрузке файла');
        }
      }
    
      async function clicked(isd) {
        try {
          let data;
          data = await ChangePhoto(isd);
        } catch (e) {
          throw e; 
        }
      }

  const id = localStorage.getItem('id');

      const [user, setUSER] = useState({ info: [] });
      const [fate, setFATE] = useState({ info: [] });
      const [bate, setBATE] = useState({ info: [] });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const date = new Date(user.created_at);
      const formattedDate = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
      });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const USERDATA1 = await FetchUser(id);
                const Fate = await fetchUserPOSTS(id);
                const Bate = await getLikeBlogs();
                setBATE(Bate);
                setFATE(Fate);
                setUSER(USERDATA1);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);
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
        {Array.isArray(fate) && fate.length > 0 && (
       <Card className='Figu1'>
       <CardTitle className='Figu2'> Посты пользователя</CardTitle>
       <Card.Body className='Figu3'>
         <h4 className='Figu4'>
           {fate.map(item => (
             <span
               key={item.id}
               onClick={() => history(`${POST_ROUTE}/${item.id}`)}
               className="hoverUnderline"
             >
               {item.title.substring(0, 20)}
               {fate.indexOf(item) === fate.length - 1 ? '' : ','}
             </span>
           ))}
         </h4>
       </Card.Body>
     </Card>
      )}

      {Array.isArray(bate) && bate.length > 0 && (
            <Card className='Figu11'>
            <CardTitle className='Figu2'> Лайки пользователя</CardTitle>
            <Card.Body className='Figu3'>
              <h4 className='Figu4'>
                {bate.map(item => (
                  <span
                    key={item.id}
                    onClick={() => history(`${POST_ROUTE}/${item.id}`)}
                    className="hoverUnderline"
                  >
                    {item.title.substring(0, 20)}
                    {bate.indexOf(item) === bate.length - 1 ? '' : ','}
                  </span>
                ))}
              </h4>
            </Card.Body>
          </Card>
            )}
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
                Отмена
              </Button>
              <Button variant="primary" onClick={CLICKED} >
                Сохранить изменения
              </Button>
            </Modal.Footer>
          </Modal>
          </>
    );
  });
  
  export default ProfileOne;