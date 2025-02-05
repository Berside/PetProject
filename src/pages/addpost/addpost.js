import { useState } from 'react'
import Button from "react-bootstrap/Button";
import { observer } from 'mobx-react-lite'
import { Container, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import './addpost.css';
import { MAIN_ROUTE } from '../../utils/consts';
import { BlogCreate } from '../../http/blogAPI';
import cameraIcon from '../../assets/camera.png';
const AddPost = observer(() => {
  const history = useNavigate()
  const location = useLocation()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

      const click = async () => {
        try {
            let data;
                data = await BlogCreate(title, description,selectedFile);
                alert('Ваш блог успешно опубликован!')
                history(MAIN_ROUTE)
        } catch (e) {
            alert(e.response.message)
        }
      }
      const [selectedFile, setSelectedFile] = useState(null);

function handleImageClick() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        cameraIcon = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  fileInput.click();
}
  
  return (
    <div className="babadyki">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="auth-form-card-1 w-75 h-75">
          <Card.Body className="d-flex flex-column justify-content-between h-100">
            <h2 className="auth-form-title text-center mb-4">Хотите создать пост?</h2>
            <span className='babpict'>
              <input className='BABKA' placeholder='Напишите название вашего блога' value={title} maxLength={300}  onChange={(e) => setTitle(e.target.value)} />
              <img src={cameraIcon} className='pict' onClick={handleImageClick} alt='Загрузить фото'></img>
            </span>
            <textarea className="flex-grow-1 mb-3 border rounded p-2" value={description} maxLength={3500}  onChange={(e) => setDescription(e.target.value)} />
            <div className="pipi justify-content-center gap-3">
              <Button className="auth-form-button w-25" variant={"outline-light"} onClick= {click}>
                Опубликовать
              </Button>
              <Button 
                className="auth-form-button w-25" 
                variant={"outline-light"}
                onClick={() => history(MAIN_ROUTE)}
              >
                Отмена
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
})

export default AddPost;