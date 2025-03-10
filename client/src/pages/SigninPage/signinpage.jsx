import './signinpage.css';
import AuthComponent from "../../components/Auth/Auth";
import Squares from '@/components/squaregrid/squaregrid';
import GradientText from '@/components/Gradienttext/gradienttext';

function SignInPage() {
  return (
    <>
      <div
        className="signin-container"
        style={{
          backgroundColor: '#0D0D0D',
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Square Grids in the background */}
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#1A1A1A"
          hoverFillColor="#00FFFF"
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
          {/* predixor Title */}
          <GradientText
            colors={["#00f0ff", "#40ffaa", "#4079ff", "#ff40ff"]} // Neon/Futuristic vibe
            animationSpeed={6}
            showBorder={false}
            className="predixor-title"
          >
            Predixor
          </GradientText>

          {/* Auth Component */}
          <div
            className="auth-box"
            style={{
              marginTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              border: 'none', // No border
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(5px)', // Optional: adds a nice glass effect
            }}
          >
            <AuthComponent />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
