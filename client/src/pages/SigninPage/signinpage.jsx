import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './signinpage.css';
import AuthComponent from "../../components/Auth/Auth";
import Squares from '@/components/squaregrid/squaregrid';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

function SignInPage() {
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

  const goToSignUp = () => {
    navigate('/SignUp');
  };

  return (
    <>
      <div
        className="signin-container"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--background-primary)' : 'var(--background-primary)',
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Add ThemeToggle here */}
        <ThemeToggle />
      
        {/* Square Grids in the background */}
        <Squares
          speed={0.5}
          squareSize={50}
          direction="diagonal"
          borderColor={theme === 'dark' ? "#1A1A1A" : "#e0e0e0"}
          hoverFillColor={theme === 'dark' ? 
            "rgba(153, 116, 191, 0.4)" : 
            "rgba(99, 99, 174, 0.3)"
          }
          className={`signin-grid ${theme}`}
        />

        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {/* Updated Logo */}
          <div className="predixor-logo">
            <h1 className="logo-text" style={{ color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)' }}>
              Pred<span className="logo-accent">ixor</span>
            </h1>
          </div>

          {/* Auth Component */}
          <div
            className="auth-box"
            style={{
              marginTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
              border: 'none', // No border
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(5px)', // Optional: adds a nice glass effect
            }}
          >
            <AuthComponent />
            
            {/* Navigate to Sign Up Link */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ 
                color: theme === 'dark' ? 'var(--text-secondary)' : 'var(--text-secondary)',
                marginBottom: '10px',
                fontSize: '14px'
              }}>
                Don't have an account?
              </p>
              <button
                onClick={goToSignUp}
                className="auth-link-button"
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
