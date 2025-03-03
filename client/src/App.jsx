
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar/navbar';
import Main from './pages/MainPage/mainpage'
import SignUpPage from './pages/Signuppage/signuppage';
import SignInPage from './pages/SigninPage/signinpage';

function App() {

  return (
    <>
     <BrowserRouter>
     <Routes>
       <Route path='/' element={<Main/>}></Route>
       <Route path='/SignUp' element={<SignUpPage/>}></Route>
       <Route path='/SignIn' element={<SignInPage/>}></Route>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
