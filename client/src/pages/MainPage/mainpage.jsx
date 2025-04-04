import './mainpage.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Squares from '@/components/squaregrid/squaregrid';
import RotatingText from 'react-rotating-text';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

function Main() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Watch for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event.detail) {
        setTheme(event.detail.theme);
      } else {
        setTheme(localStorage.getItem('theme') || 'dark');
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

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
          backgroundColor: theme === 'dark' ? 'var(--background-primary)' : 'var(--background-primary)',
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Add ThemeToggle here */}
        <ThemeToggle />
        
        {/* Background animated squares */}
        <Squares 
          speed={0.5} 
          squareSize={50}  // Increased square size for better visibility
          direction='diagonal'
          borderColor={theme === 'dark' ? "#1A1A1A" : "#e0e0e0"}
          hoverFillColor={theme === 'dark' ? 
            "rgba(153, 116, 191, 0.4)" :  // More translucent in dark mode
            "rgba(99, 99, 174, 0.3)"      // More translucent in light mode
          }
          className={`main-grid ${theme}`}
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
          {/* Predixor Logo - Matched with home page style */}
          <div className="predixor-logo">
            <h1 className="logo-text" style={{ 
              fontSize: '100px',
              color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)'
            }}>
              Pred<span className="logo-accent">ixor</span>
            </h1>
          </div>

          {/* Rotating Slogan Text */}
          <div 
            style={{
              marginTop: '20px',
              fontSize: '2rem',
              color: theme === 'dark' ? 'var(--accent-primary)' : 'var(--accent-primary)',
              fontFamily: 'Montserrat, sans-serif',
              background: 'transparent',
              fontWeight: 700
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

          {/* Sign In/Up Buttons */}
          <div 
            style={{
              marginTop: '40px',
              display: 'flex',
              gap: '20px'
            }}
          >
            <button 
              className="auth-button signup-button"
              onClick={GoToSignUp}
              style={{
                background: theme === 'dark' ? 
                  'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))' : 
                  'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))'
              }}
            >
              Sign Up
            </button>
            <button 
              className="auth-button signin-button"
              onClick={GoToSignIn}
              style={{
                color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)',
                borderColor: theme === 'dark' ? 'var(--border-color)' : 'var(--border-color)'
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
