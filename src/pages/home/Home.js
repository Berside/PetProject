import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import './home.css';
import { fetchPOSTS } from '../../http/blogAPI';
import { Card } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import { POST_ROUTE } from '../../utils/consts';

const Home = observer(() => {
    const [posts, setPosts] = useState([]);
    const [isSorted, setIsSorted] = useState(false);
    const [isSortedAlphabetically, setIsSortedAlphabetically] = useState(false);
    const history = useNavigate()
    useEffect(() => {
        fetchPOSTS().then(data => setPosts(data));
    }, []);
    const handleSort = () => {
        if (!isSorted) {
          const sortedPosts = [...posts].sort((a, b) => b.likes - a.likes);
          setPosts(sortedPosts);
        } else {
          fetchPOSTS().then(data => setPosts(data));
        }
        setIsSorted(!isSorted);
      };
      const sortPostsAlphabetically = () => {
        if (!isSortedAlphabetically) {
          const sortedPosts = [...posts].sort((a, b) => 
            a.title.localeCompare(b.title, 'ru', { sensitivity: 'case' })
          );
          setPosts(sortedPosts);
        } else {
          fetchPOSTS().then(data => setPosts(data));
        }
        setIsSortedAlphabetically(!isSortedAlphabetically);
      };
    return (
        <div className='babka'>
            <div className='degrod'>
                <Button 
                    variant='outline-light'
                    size="sm"
                    onClick={handleSort}
                    className="me-2"
                >
                {isSorted ? 'Сбросить сортировку по лайкам' : 'Сортировка по лайкам'}
                </Button>
                <Button 
                    variant='outline-light'
                    size="sm"
                    onClick={sortPostsAlphabetically}
                    className="me-2"
                >
                {isSortedAlphabetically ? 'Сбросить алфавитную сортировку' : 'Алфавитная сортировка'}
                </Button>
        </div>
            <Container>
                <Row>
                    {posts.map(post => (
                        <Col key={post.id} xs={12} md={6} lg={4}  onClick={() => history(POST_ROUTE + '/' + post.id)}>
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
        </div>
    );
});

export default Home;