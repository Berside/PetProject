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

const COMMENTS_PER_PAGE = 5;

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



    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const getTotalPages = (totalItems) => {
        return Math.ceil(totalItems / COMMENTS_PER_PAGE);
    };
        const fetchPaginatedComments = async () => {
            try {
                const response = await FetchPostComments(id);
                setTotalPages(getTotalPages(response.length));
                let sortedResponse = [...response];
                const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
                const paginatedPosts = sortedResponse.slice(startIndex, startIndex + COMMENTS_PER_PAGE);
                setComments(paginatedPosts);
            } catch (error) {
                console.error('Ошибка при загрузке постов:', error);
            }
        };

            useEffect(() => {
                fetchPaginatedComments();
            }, [currentPage, id]);

            const handlePageChange = (page) => {
                setCurrentPage(page);
            };




    useEffect(() => {
        if  ( userbase.role === 'admin' ) {
            user.setIsAdmin(true)
        }
        const fetchData = async () => {
            try {
                const postData = await FetchPost(id);
                setPost(postData);
                const commentsData = await FetchPostComments(id);
                setCurrentPage(1);
                setTotalPages(getTotalPages(commentsData.length));
                const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
                const paginatedPosts = commentsData.slice(startIndex, startIndex + COMMENTS_PER_PAGE);
                setComments(paginatedPosts);
                
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
        fetchPaginatedComments();
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;

    const adminBtn = async (PostId) => {
        try {
            let data;
            data = await  DeleteBlog(PostId);
            history(MAIN_ROUTE);
        } catch (e) {
                alert(e.response.message);
        }
    }
    const adminBtnCo = async (Comment_id) => {
        try {
            let data;
            data = await  DeleteComment(Comment_id);
            const commentsData = await FetchPostComments(id);
            setCurrentPage(1);
            setTotalPages(getTotalPages(commentsData.length));
            const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
            const paginatedPosts = commentsData.slice(startIndex, startIndex + COMMENTS_PER_PAGE);
            setComments(paginatedPosts);
        } catch (e) {
                alert(e.response.message);
        }
    }
    const click = async () => {
        try {
          if (!UserText.trim()) {
            alert('Пожалуйста, введите текст комментария');
            setUserText('');
            return;
          }

          const words = UserText.split(/\s+/);
          const tooLongWords = words.filter(word => word.length > 20);

          if (tooLongWords.length > 0) {
            alert(`Обнаружены слишком длинные слова (${tooLongWords.join(', ')})`);
            setUserText('');
            return;
          }

          let data;
          data = await CommentCreate(UserText, id);
          const commentsData = await FetchPostComments(id);
          setCurrentPage(1);
          setTotalPages(getTotalPages(commentsData.length));
          const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
          const paginatedPosts = commentsData.slice(startIndex, startIndex + COMMENTS_PER_PAGE);
          setComments(paginatedPosts);
          setUserText('');
        } catch (e) {
          alert(e.response.message);
        }
      };
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
        <div className='babkakek'>
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
                    <Card.Text className="textovil" >
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
                    minLength={1}
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
            <nav aria-label="Страницы">
                <ul className="pagination justify-content-center mt-3">
                    <li className="page-item">
                        <button className={`page-link ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} aria-disabled={currentPage === 1}>
                            ←
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`} >
                            <button  className="page-link" onClick={() => handlePageChange(pageNum)} >
                                {pageNum}
                            </button>
                        </li>
                    ))}

                    <li className="page-item">
                        <button  className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} aria-disabled={currentPage === totalPages}>
                            →
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
});

export default PostPage;