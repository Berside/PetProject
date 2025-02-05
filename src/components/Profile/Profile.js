import React from 'react';
import {Card, Col} from "react-bootstrap";
import {useNavigate } from "react-router-dom"
import {POST_ROUTE} from "../../utils/consts";

const Profile = ({device}) => {
    const history = useNavigate ()
    return (
        <Col md={3} className={"mt-3"} onClick={() => history(POST_ROUTE + '/' + device.id)}>
            <Card style={{width: 150, cursor: 'pointer'}} border={"light"}>
            </Card>
        </Col>
    );
};

export default Profile;