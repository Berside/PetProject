import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import './home.css';
import { fetchPOSTS } from '../../http/blogAPI';
import { Card } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import { POST_ROUTE } from '../../utils/consts';

const ITEMS_PER_PAGE = 30;

const Home = observer(() => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isSortingByLikes, setIsSortingByLikes] = useState(false);
    const [isSortingAlphabetically, setIsSortingAlphabetically] = useState(false);
    const history = useNavigate();
    const getTotalPages = (totalItems) => {
        return Math.ceil(totalItems / ITEMS_PER_PAGE);
    };
    const fetchPaginatedPosts = async () => {
        try {
            const response = await fetchPOSTS();
            setTotalPages(getTotalPages(response.length));
            let sortedResponse = [...response];
            if (isSortingByLikes) {
                sortedResponse.sort((a, b) => b.likes - a.likes);
            }
            if (isSortingAlphabetically) {
                sortedResponse.sort((a, b) => 
                    a.title.localeCompare(b.title, 'ru', { sensitivity: 'case' })
                );
            }
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const paginatedPosts = sortedResponse.slice(startIndex, startIndex + ITEMS_PER_PAGE);
            setPosts(paginatedPosts);
        } catch (error) {
            console.error('Ошибка при загрузке постов:', error);
        }
    };

    useEffect(() => {
        fetchPaginatedPosts();
    }, [currentPage, isSortingByLikes, isSortingAlphabetically]);

    const handleSort = () => {
        if (isSortingAlphabetically) {
            setIsSortingAlphabetically(false);
            return;
        }
        if (isSortingByLikes) {
            setIsSortingByLikes(false);
            fetchPaginatedPosts();
            return;
        }
        
        setIsSortingByLikes(true);
        fetchPaginatedPosts();
    };
    
    const sortPostsAlphabetically = () => {
        if (isSortingByLikes) {
            setIsSortingByLikes(false);
            fetchPaginatedPosts();
            return;
        }
        if (isSortingAlphabetically) {
            setIsSortingAlphabetically(false);
            fetchPaginatedPosts();
            return;
        }
        
        setIsSortingAlphabetically(true);
        fetchPaginatedPosts();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='babka'>
            <div className='degrod'>
                <Button 
                    variant={isSortingByLikes ? 'secondary' : 'outline-light'}
                    size="sm"
                    onClick={handleSort}
                    className={`me-2 transition-all duration-200 ${
                        isSortingByLikes ? 'scale-110 font-semibold' : ''
                    }`}
                >
                    Сортировка по лайкам
                </Button>
                
                <Button 
                    variant={isSortingAlphabetically ? 'secondary' : 'outline-light'}
                    size="sm"
                    onClick={sortPostsAlphabetically}
                    className={`me-2 transition-all duration-200 ${
                        isSortingAlphabetically ? 'scale-110 font-semibold' : ''
                    }`}
                >
                    Алфавитная сортировка
                </Button>
            </div>

            <Container>
                <Row>
                    {posts.map(post => (
                        <Col key={post.id} xs={12} md={6} lg={4} 
                             onClick={() => history(POST_ROUTE + '/' + post.id)}>
                            <Card className="krak" style={{cursor: 'pointer'}}>
                                <Card.Body>
                                    <Card.Title>
                                        {post.title.length > 15 ? `${post.title.substring(0, 15)}...` : post.title}
                                    </Card.Title>
                                    <Card.Text className="text-muted">
                                        Автор: {post.owner.username}
                                        <br></br>
                                        Likes: {post.likes}
                                    </Card.Text>
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

export default Home;