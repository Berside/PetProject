import React, {useContext, useEffect, useState} from 'react';
import AppRouter from './components/AppRouter';
import Bar from './components/NavBar/Navbar';
import { observer } from 'mobx-react-lite';
import {check} from "./http/userAPI";
import {Spinner} from "react-bootstrap";
import { Context } from './index';
const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
      check().then(data => {
          user.setUser(true)
          user.setIsAuth(true)
      }).finally(() => setLoading(false))
  }, [])

  if (loading) {
      return <Spinner animation={"grow"}/>
  }
  return (
      <div>
        <Bar/> 
        <AppRouter />
      </div>
  );
});

export default App;