
import { BrowserRouter,Routes,Route, Outlet } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar/navbar';
import Main from './pages/MainPage/mainpage'
import SignUpPage from './pages/Signuppage/signuppage';
import SignInPage from './pages/SigninPage/signinpage';
import Homepage from './pages/HomePage/homepage';
import AdminPage from './pages/AdminPages/admindashboard';
import PrivateRoute from './components/PrivateRoute/privateroute';
import Demo from './pages/Demo/demo';
import EventPage from './pages/EventPages/eventpages';

function App() {

  return (
    <>

     <BrowserRouter>
     <Routes>
       <Route path='/' element={<Main/>}></Route>
       <Route path='/SignUp' element={<SignUpPage/>}></Route>
       <Route path='/SignIn' element={<SignInPage/>}></Route>
       <Route path='/home' element={<PrivateRoute/>}>
          <Route index element={<Homepage/>}/>
          <Route path='events' element={<EventPage/>} />
       </Route>
       <Route path='/admin' element={<AdminPage></AdminPage>}/>
       <Route path='/demo' element={<Demo/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
