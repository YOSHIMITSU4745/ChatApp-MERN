import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import {Provider} from "react-redux";
import { createRoutesFromElements, Route, RouterProvider} from "react-router";
import { createBrowserRouter } from 'react-router-dom';


//self made
import store from './redux/store.js';
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Profile from './pages/users/Profile.jsx';
import CreateRoom from './pages/room/createRoom.jsx';
import Room from './pages/room/Room.jsx';
import SearchPage from './pages/SearchPage.jsx';
import UpdateRoomForm from './pages/room/updateRoomform.jsx';
import TitleManagerPage from './pages/title/createTitle.jsx';
import AdminPage from './pages/admin/adminPage.jsx';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route index path='/' element={<Home/>}/>
      <Route  path='/login' element={<Login/>}/>
      <Route  path='/register' element={<Register/>}/>
      <Route  path='/profile' element={<Profile/>}/>
      <Route  path='/createroom' element={<CreateRoom/>}/>
      <Route path='/room/:id' element={<Room/>}/>
      <Route path='/search' element={<SearchPage/>}/>
      <Route path='/updateroom/:id' element={<UpdateRoomForm/>} />
      <Route path='/managetitles' element={<TitleManagerPage/>} />
      <Route path='/admin' element={<AdminPage/>} />

      
    </Route>
  )
);

createRoot(document.getElementById('root')).render(

<Provider store={store}>
<RouterProvider router={router}/>
</Provider>
);


