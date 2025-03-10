import './mainpage.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Squares from '@/components/squaregrid/squaregrid';
import GradientText from '@/components/Gradienttext/gradienttext';
import RotatingText from 'react-rotating-text'; // Using react-rotating-text!
import SignButtons from '../../components/SignButtons/signbuttons';

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
      <div 
        className="main-container" 
        style={{
          backgroundColor: '#0D0D0D',
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Background animated squares */}
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='#1A1A1A'
          hoverFillColor='#00FFFF'
        />

        {/* Content in the middle */}
        <div 
          style={{
            position: 'absolute',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {/* predixor Title */}
          <GradientText
            colors={["#00f0ff", "#40ffaa", "#4079ff"]}
            animationSpeed={3}
            showBorder={false}
            className="predixor-title"
            style={{
                fontFamily: 'Montserrat, sans-serif', // ✅ Applied Montserrat
                fontSize: '5rem',                      // ✅ You can adjust this
                fontWeight: '700',                     // ✅ Make it bold for more impact
              }}
          >
            Predixor
          </GradientText>

          {/* Rotating Slogan Text */}
          <div 
            style={{
              marginTop: '20px',
              fontSize: '2rem', // 🔥 Increase size here (2rem = 32px)
              color: '#00FFFF',
              fontFamily: 'Montserrat, sans-serif',
              background: 'transparent',
              fontWeight:700
            }}
          >
            <RotatingText 
              items={[
                "See the Future. Shape the Game.",
                "Predict Smarter. Win Bigger.",
                "Your Vision. Your Victory."

              ]}
              typingInterval={100}
              emptyPause={1000}
              pause={2000}
            />
          </div>

          <div 
            className="dynamic-box"
            style={{
                marginTop: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                border: 'none', // 🟢 Removed the border here!
                padding: '20px',
                borderRadius: '12px'
            }}
            >
            <SignButtons onClick={GoToSignUp} text={'Sign Up'} label={'Create New Account'} />
            <SignButtons onClick={GoToSignIn} text={'Sign In'} label={'Already Have An Account?'} />
            </div>
        </div>
      </div>
    </>
  );
}

export default Main;
