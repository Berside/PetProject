import React, { useEffect, useState } from 'react';
import { CardImg, Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { fetchPOSTS } from '../../http/blogAPI';
import { Card } from 'react-bootstrap';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useParams} from 'react-router-dom'
import { FetchPost, FetchPostComments } from '../../http/blogAPI';
import { CommentCreate } from '../../http/CommentAPI';
import './Postpage.css';
import userIcon from '../../assets/user.png'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { PROFILE_ROUTE } from '../../utils/consts';
const PostPage = observer(() => {
    const bucketName = process.env.NEXT_PUBLIC_YANDEX_BUCKET_NAME || 'blogs-data/';
    const [post, setPost] = useState({ info: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useNavigate()
    const [comments, setComments] = useState([]);
    const { id } = useParams();
    const [UserText, setUserText] = useState('')
    useEffect(() => {
        const fetchData = async () => {
            try {
                const postData = await FetchPost(id);
                setPost(postData);
                const commentsData = await FetchPostComments(id);
                setComments(commentsData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;
    console.log(post);
    console.log(post.images);
    const imageUrl = `https://storage.yandexcloud.net/${bucketName}${post.images}`;
    console.log(imageUrl)
          const click = async () => {
            try {
                let data;
                    data = await CommentCreate(UserText, id);
                    const commentsData = await FetchPostComments(id);
                    setComments(commentsData);
            } catch (e) {
                alert(e.response.message)
            }
          }

    return (
        <div className='babka'>
            <Container className='pip'>
                <Card className='maybefo'>
                    <Card.Body>
                        <Card.Title className='tatle'> {post.title} </Card.Title>
                    </Card.Body>
                    <Card.Text className="textovik">
                        Автор: {post.owner?.username || 'Неизвестный автор'}
                    </Card.Text>
                    <Card.Text className="textovik">
                        {post.description}
                    </Card.Text>
                    {post.images && post.images.length > 0 ? (
                        <Card.Img 
                            src={`https://storage.yandexcloud.net/${bucketName}${post.images}`} 
                            className='pfuck'
                        />
                        ) : null}
                </Card>
                <InputGroup className="FOCK">
        <Form.Control
            className='pipka'
          placeholder="Напишите комментарий!"
          maxLength={2000} 
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={UserText}
          onChange={(e) => setUserText(e.target.value)}
        />
        <Button variant="outline-secondary" id="button-addon2" className='FOCK' onClick= {click}>
        Отправить
        </Button>
      </InputGroup>
                <Row>
                    {comments.map(comment => (
                        <Col key={comment.id} xs={200}>
                            <Card className="krak">
                                <Card.Body className='d-flex'>
                                    <CardImg src={comment.owner?.pfp_path ? `https://storage.yandexcloud.net/${bucketName}${comment.owner.pfp_path}` : userIcon} className='commentImg' onClick={() => history(PROFILE_ROUTE + '/' + comment.id)}></CardImg>
                                   <Col className='fdsa'>
                                   <Card.Title className='mb-2'>Автор: {comment.owner?.username || 'Неизвестный автор'}</Card.Title>
                                    <Card.Text className="text-fucked">
                                    {comment.text}
                                    </Card.Text>
                                   </Col>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
});

export default PostPage;