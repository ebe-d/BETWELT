import './mainpage.css';
import AuthComponent from "../../components/Auth/Auth";
import SignButtons from '../../components/SignButtons/signbuttons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Main() {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    function GoToSignIn() {
        navigate('/SignIn');
    }
    
    function GoToSignUp() {
        navigate('/SignUp');
    }

    return (
        <>
            <div style={{ 
                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                height: '100vh', width: '100vw' 
            }}>
                <div style={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center' 
                }} id="brand">
                    
                    <div 
                        onMouseEnter={() => setIsHovered(true)} 
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <span 
                            className="logo" 
                            style={{ color: isHovered ? '#000000' : '#FF0050' }}
                        >
                            BET
                        </span>
                        <span 
                            className="logo2" 
                            style={{ color: isHovered ? '#FF0050' : '#000000' }}
                        >
                            WELT
                        </span>
                    </div>
                    
                    <div className="slogan" style={{ marginBottom: 40 }}>
                        "Your Game, Your World, Your Victory!"
                    </div>

                    <div className="dynamic-box" style={{width: 300, height: 200, marginTop: 40, display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginTop: -25}}>
                            <SignButtons onClick={GoToSignUp} text={'Sign Up'} label={'Create New Account'} />
                            <SignButtons onClick={GoToSignIn} text={'Sign In'} label={'Already Have An Account?'} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;