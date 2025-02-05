import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import './home.css';
import { fetchPOSTS } from '../../http/blogAPI';
import { Card } from 'react-bootstrap';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import { POST_ROUTE } from '../../utils/consts';


const Home = observer(() => {
    const [posts, setPosts] = useState([]);
    const history = useNavigate()
    useEffect(() => {
        fetchPOSTS().then(data => setPosts(data));
    }, []);

    return (
        <div className='babka'>
            <Container>
                <Row>
                    {posts.map(post => (
                        <Col key={post.id} xs={12} md={6} lg={4}  onClick={() => history(POST_ROUTE + '/' + post.id)}>
                            <Card className="krak" style={{cursor: 'pointer'}}>
                                <Card.Body>
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text className="text-muted">
                                        Автор: {post.owner.username}
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