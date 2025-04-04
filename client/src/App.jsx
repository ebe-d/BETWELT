import { BrowserRouter,Routes,Route, Outlet, useLocation } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar/navbar';
import Footer from './components/Footer/footer';
import ChatBotWidget from './components/ChatBot/ChatBotWidget';
import Main from './pages/MainPage/mainpage'
import SignUpPage from './pages/Signuppage/signuppage';
import SignInPage from './pages/SigninPage/signinpage';
import Homepage from './pages/HomePage/homepage';
import AdminPage from './pages/AdminPages/AdminPage';
import PrivateRoute from './components/PrivateRoute/privateroute';
import Demo from './pages/Demo/demo';
import EventPage from './pages/EventPages/eventpages';
import EventDetail from './pages/EventPages/EventDetail';
import WalletPage from './pages/WalletPage/WalletPage';
import HelpPage from './pages/HelpPage/HelpPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import { UserProvider } from './context/UserContext';

// Layout component to conditionally render footer and chatbot
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/' || location.pathname === '/SignIn' || location.pathname === '/SignUp';
  
  return (
    <>
      {children}
      {!isAdminRoute && !isAuthRoute && <Footer />}
      {!isAdminRoute && !isAuthRoute && <ChatBotWidget />}
    </>
  );
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Main/>}></Route>
            <Route path='/SignUp' element={<SignUpPage/>}></Route>
            <Route path='/SignIn' element={<SignInPage/>}></Route>
            <Route path='/home' element={<PrivateRoute/>}>
               <Route index element={<Homepage/>}/>
               <Route path='events' element={<EventPage/>} />
               <Route path='events/:id' element={<EventDetail/>} />
               <Route path='wallet' element={<WalletPage/>} />
               <Route path='help' element={<HelpPage/>} />
               <Route path='profile' element={<ProfilePage/>} />
               <Route path='settings' element={<SettingsPage/>} />
            </Route>
            <Route path='/admin/*' element={<AdminPage />}/>
            <Route path='/demo' element={<Demo/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
