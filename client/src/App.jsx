
import { BrowserRouter,Routes,Route, Outlet } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar/navbar';
import Main from './pages/MainPage/mainpage'
import SignUpPage from './pages/Signuppage/signuppage';
import SignInPage from './pages/SigninPage/signinpage';
import Homepage from './pages/HomePage/homepage';
import AdminPage from './pages/AdminPages/admindashboard';
import Events from './pages/EventPages/eventpages';
import PrivateRoute from './components/PrivateRoute/privateroute';
import Demo from './pages/Demo/demo';


function App() {

  return (
    <>

     <BrowserRouter>
     <Routes>
       <Route path='/' element={<Main/>}></Route>
       <Route path='/SignUp' element={<SignUpPage/>}></Route>
       <Route path='/SignIn' element={<SignInPage/>}></Route>
       <Route path='/Home' element={<PrivateRoute/>}>
          <Route index element={<Homepage/>}/>
          <Route path='Events' element={<Events/>} />
       </Route>
       <Route path='/admin' element={<AdminPage></AdminPage>}/>
       <Route path='/demo' element={<Demo/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
