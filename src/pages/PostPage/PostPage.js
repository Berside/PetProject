import React, { useEffect, useState, useContext } from 'react';
import { CardImg, Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Card } from 'react-bootstrap';
import {useNavigate, useParams, useLocation} from "react-router-dom";
import { FetchPost, FetchPostComments, DeleteBlog, AddLikePost, likedBy } from '../../http/blogAPI';
import { CommentCreate, DeleteComment } from '../../http/CommentAPI';
import './Postpage.css';
import userIcon from '../../assets/user.png'
import Form from 'react-bootstrap/Form';
import strelka from '../../assets/StrelkaIco.png'
import InputGroup from 'react-bootstrap/InputGroup';
import { MAIN_ROUTE, PROFILE_ROUTE, POST_ROUTE } from '../../utils/consts';
import croosfoot from '../../assets/IconsKres.png';
import { FetchUser } from '../../http/userAPI';
import Liked from '../../assets/Liked.png'
import Unliked from '../../assets/Unliked.png'
import { Context } from "../../index";
const PostPage = observer(() => {
    const location = useLocation();
    const {user} = useContext(Context)
    const IDE = localStorage.getItem('id');
    const bucketName = process.env.NEXT_PUBLIC_YANDEX_BUCKET_NAME || 'blogs-data/';
    const [post, setPost] = useState({ info: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useNavigate()
    const [likedBase, SetlikedBase] = useState([]);
    const [comments, setComments] = useState([]);
    const [userbase, setuserbase] = useState([]);
    const { id } = useParams();
    const [UserText, setUserText] = useState('')
    useEffect(() => {
        if  ( userbase.role === 'admin' ) {
            user.setIsAdmin(true)
        }
        const fetchData = async () => {
            try {
                const postData = await FetchPost(id);
                setPost(postData);
                const commentsData = await FetchPostComments(id);
                setComments(commentsData);
                if (user.isAuth) {
                    const UserData = await FetchUser(IDE);
                    setuserbase(UserData);
                    const LidDATA = await likedBy(id);
                    SetlikedBase(LidDATA);
                }
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

    const adminBtn = async (PostId) => {
        try {
            let data;
            data = await  DeleteBlog(PostId);
            alert('Пост успешно удален')
            history(MAIN_ROUTE);
        } catch (e) {
                alert(e.response.message);
        }
    }
    const adminBtnCo = async (Comment_id) => {
        try {
            let data;
            data = await  DeleteComment(Comment_id);
            alert('Комментарий успешно удален')
        } catch (e) {
                alert(e.response.message);
        }
    }
    const click = async () => {
        try {
            let data;
                data = await CommentCreate(UserText, id);
                const commentsData = await FetchPostComments(id);
                setComments(commentsData);
                setUserText('');
        } catch (e) {
            alert(e.response.message)
        }
    }
    const toggleLikeBy = async (postId) => {
        try {
            const isLiked = likedBase.some(item => item.id === Number(IDE));
            await AddLikePost(postId);
            setPost(prev => ({...prev, likes: prev.likes + (isLiked ? -1 : 1)}));
            SetlikedBase(prev =>
                isLiked
                    ? prev.filter(item => item.id !== Number(IDE))
                    : [...prev, { id: IDE }]
            );
            window.location.reload();
        } catch (error) {
            alert(error.message || 'Ошибка при добавлении лайка');
        }
    };
    return (
        <div className='babka'>
            <Container className='pip'>
                <Card className='maybefo'>
                    <Card.Body className="cardbodyADM">
                        <Card.Title className='tatleADM'> {post.title} </Card.Title>
                        {userbase.role === 'admin' && (
                            <img src={croosfoot} onClick={() => {adminBtn(post.id)}} className='adminImageADM' alt="Admin Image" />
                        )}
                    </Card.Body>
                    <Card.Text 
                    className="textovik" 
                    onClick={() => {
                        if (IDE == post.owner?.id) {
                        history(PROFILE_ROUTE);
                        } else {
                        history(`${PROFILE_ROUTE}/${post.owner?.id}`);
                        }
                    }} 
                    style={{ cursor: 'pointer' }}
                    >
                    Автор: {post.owner?.username || 'Неизвестный автор'}
                    </Card.Text>
                    <Card.Text className="textovil">
                        {post.description}
                        <span className='textovil'><br></br>Likes: {post.likes}<br></br></span>
                        {user.isAuth && (
                            <img 
                            className='FIMG'
                            src={likedBase.some(item => item.id ===  Number(IDE)) ? Unliked : Liked}
                            onClick={() => toggleLikeBy(post.id)}
                            alt="Like button"
                            />
                        )}
                    </Card.Text>
                    {post.images && post.images.length > 0 ? (
                    <div className="image-container">
                        {post.images.map((imageUrl, index) => (
                        <Card.Img
                            key={`${index}-${imageUrl}`}
                            src={`https://storage.yandexcloud.net/${bucketName}${imageUrl}`}
                            className='pfuck'
                        />
                        ))}
                    </div>
                    ) : null}
                </Card>
                <InputGroup className="FOCK">
                {user.isAuth && (
                <span className='FigVam'>
                    <Form.Control
                    className='pipka'
                    placeholder="Напишите комментарий!"
                    maxLength={1900} 
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={UserText}
                    onChange={(e) => setUserText(e.target.value)}
                    />
                    <img src={strelka} className='irudit 'onClick= {click}></img>
                </span>
        )}
      </InputGroup>
                <Row> 
                    {comments.map(comment => (
                        <Col key={comment.id} xs={200}>
                            <Card className="kraki">
                                <Card.Body className='d-flex'>
                                {userbase.role === 'admin' && (
                                 <img src={croosfoot} onClick={() => {adminBtnCo(comment.id)}} className='adminImageADM' alt="Admin Image" />
                                )}
                                <CardImg 
                                src={comment.owner?.pfp_path ? `https://storage.yandexcloud.net/${bucketName}${comment.owner.pfp_path}` : userIcon} 
                                className='commentImg'
                                onClick={() => {
                                    if (IDE == comment.owner?.id) {
                                    history(PROFILE_ROUTE);
                                    } else {
                                    history(PROFILE_ROUTE + '/' + comment.owner?.id)
                                    }
                                }}
                                />
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