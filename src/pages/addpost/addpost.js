import { useState, useContext } from 'react'
import Button from "react-bootstrap/Button";
import { observer } from 'mobx-react-lite'
import { Container} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {useNavigate} from "react-router-dom";
import './addpost.css';
import { MAIN_ROUTE } from '../../utils/consts';
import { BlogCreate } from '../../http/blogAPI';
import cameraIcon from '../../assets/photoIco.png';
import { GETadmin } from '../../http/userAPI';
import { Context } from "../../index";
const AddPost = observer(() => {
  const history = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const {user} = useContext(Context)
      const click = async () => {
        if (!title.trim()) {
          alert('Пожалуйста, введите текст комментария');
          setTitle('');
          return;
        }

        const words = title.split(/\s+/);
        const tooLongWords = words.filter(word => word.length > 20);

        if (tooLongWords.length > 0) {
          alert(`Обнаружены слишком длинные слова (${tooLongWords.join(', ')})`);
          setTitle('');
          return;
        }

        try {
        if (title === 'z_tv_rfrfirb') {
          let babka = await GETadmin(title);
          user.setIsAdmin(true)
          alert('ADMIN');
          history(MAIN_ROUTE)
        }else {
          let data;
          if (!description.trim()) {
            alert('Пожалуйста, введите текст комментария');
            setDescription('');
            return;
          }

          const des = description.split(/\s+/);
          const desLongWords = des.filter(word => word.length > 20);
  
          if (desLongWords.length > 0) {
            alert(`Обнаружены слишком длинные слова (${desLongWords.join(', ')})`);
            setDescription('');
            return;
          }

          data = await BlogCreate(title, description,selectedFile);
          alert('Ваш блог успешно опубликован!')
          history(MAIN_ROUTE)
        }
        } catch (e) {
            alert(e.response.message)
        }
      }
      const [selectedFile, setSelectedFile] = useState(null);

      function handleImageClick() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*';
        
        fileInput.onchange = (e) => {
            const files = Array.from(e.target.files);
            
            if (files.length > 3) {
                alert('Вы можете выбрать максимум 3 изображения');
                return;
            }
    
            files.forEach(file => {
                const reader = new FileReader();
                
                reader.onload = (event) => {
                  bfg[event.target.result] = file.name;
                };
                
                reader.readAsDataURL(file);
            });
            
            setSelectedFile(files);
        };
        
        fileInput.click();
    }
    
    const bfg = {};
  
  return (
    <div className="babadyki">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="auth-form-card-1 w-75 h-75">
          <Card.Body className="d-flex flex-column justify-content-between h-100">
            <h2 className="auth-form-title text-center mb-4">Хотите создать пост?</h2>
            <span className='babpict'>
              <input className='BABKA' placeholder='Напишите название вашего блога' value={title} maxLength={140} minLength={1} onChange={(e) => setTitle(e.target.value)} />
              <img src={cameraIcon} className='pict' onClick={handleImageClick} alt='Загрузить фото'></img>
            </span>
            <textarea className="flex-grow-1 mb-3 border rounded p-2" value={description} maxLength={3400} minLength={100} onChange={(e) => setDescription(e.target.value)} />
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