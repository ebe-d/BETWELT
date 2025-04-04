import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function AuthComponent({ isSignUp }) {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
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

  // Generate appearance based on current theme
  const customAppearance = {
    layout: {
      socialButtonsVariant: "iconButton",
      showOptionalFields: false,
      termsPageUrl: null,
      privacyPageUrl: null,
    },
    elements: {
      card: {
        backgroundColor: theme === 'dark' ? "#0D0D0D" : "#ffffff",
        borderRadius: "12px",
        boxShadow: theme === 'dark' 
          ? "0 0 20px rgba(153, 116, 191, 0.3)" 
          : "0 0 20px rgba(99, 99, 174, 0.2)",
        width: "30vw",
        border: `1px solid ${theme === 'dark' ? '#9974bf' : '#6363ae'}`,
        transition: "all 0.4s ease-in-out",
      },
      cardBox: {
        width: "30vw",
      },
      headerTitle: {
        color: theme === 'dark' ? "#9974bf" : "#6363ae",
        fontSize: "28px",
        fontWeight: "bold",
        textShadow: theme === 'dark' 
          ? "0 0 8px rgba(153, 116, 191, 0.5)" 
          : "0 0 8px rgba(99, 99, 174, 0.3)",
      },
      headerSubtitle: {
        fontSize: "20px",
        color: theme === 'dark' ? "#ffffff" : "#111111",
        fontWeight: "600",
        marginBottom: "10px",
      },
      formFieldLabel: {
        fontSize: "16px",
        color: theme === 'dark' ? "#ffffff" : "#111111",
        marginBottom: "6px",
        transition: "color 0.3s",
      },
      inputField: {
        border: `2px solid ${theme === 'dark' ? '#9974bf' : '#6363ae'}`,
        backgroundColor: theme === 'dark' ? "#0D0D0D" : "#f9f9f9",
        color: theme === 'dark' ? "#ffffff" : "#111111",
        padding: "12px",
        borderRadius: "8px",
        transition: "all 0.3s ease-in-out",
      },
      inputField__focused: {
        border: `2px solid ${theme === 'dark' ? '#7474bf' : '#7474bf'}`,
        boxShadow: theme === 'dark' 
          ? "0 0 8px rgba(153, 116, 191, 0.6)" 
          : "0 0 8px rgba(99, 99, 174, 0.6)",
      },
      inputField__invalid: {
        border: "2px solid #FF3B3B",
        boxShadow: "0 0 8px rgba(255, 59, 59, 0.6)",
      },
      inputLabel: {
        fontSize: "22px",
        fontWeight: "bold",
        color: theme === 'dark' ? "#ffffff" : "#111111",
      },
      input: {
        placeholderColor: theme === 'dark' ? "#686868" : "#999999",
        color: theme === 'dark' ? "#ffffff" : "#111111",
        backgroundColor: "transparent",
        fontSize: "16px",
      },
      button: {
        border: `2px solid ${theme === 'dark' ? '#9974bf' : '#6363ae'}`,
        color: theme === 'dark' ? "#0D0D0D" : "#ffffff",
        backgroundColor: theme === 'dark' ? "#9974bf" : "#6363ae",
        borderRadius: "8px",
        padding: "10px 20px",
        fontWeight: "bold",
        transition: "all 0.3s ease-in-out",
      },
      button__hover: {
        backgroundColor: theme === 'dark' ? "#7474bf" : "#7474bf",
        borderColor: theme === 'dark' ? "#7474bf" : "#7474bf",
        boxShadow: theme === 'dark' 
          ? "0 0 10px rgba(116, 116, 191, 0.6)" 
          : "0 0 10px rgba(99, 99, 174, 0.6)",
        transform: "translateY(-2px)",
      },
      socialButtonsBlockButton: {
        border: `2px solid ${theme === 'dark' ? '#9974bf' : '#6363ae'}`,
        color: theme === 'dark' ? "#9974bf" : "#6363ae",
        transition: "all 0.3s ease",
      },
      socialButtonsBlockButton__hover: {
        backgroundColor: theme === 'dark' ? "#9974bf" : "#6363ae",
        color: theme === 'dark' ? "#0D0D0D" : "#ffffff",
      },
      socialButtonsIconButton: {
        backgroundColor: theme === 'dark' ? "#1a1a1a" : "#FFFFFF",
        boxShadow: theme === 'dark' 
          ? "0 0 15px rgba(153, 116, 191, 0.5)" 
          : "0 0 15px rgba(99, 99, 174, 0.5)",
        margin: "5px",
        padding: "10px",
        borderRadius: "8px",
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        border: theme === 'dark' ? "1px solid #333333" : "none",
      },
      socialButtonsIconButton__hover: {
        backgroundColor: theme === 'dark' ? "#252525" : "#FFFFFF",
        boxShadow: theme === 'dark' 
          ? "0 0 20px rgba(153, 116, 191, 0.8)" 
          : "0 0 20px rgba(99, 99, 174, 0.8)",
        transform: "translateY(-2px)",
      },
      socialButtonsProviderIcon: {
        // Keeping Google logo's original colors
        width: "28px",
        height: "28px",
        filter: theme === 'dark' ? "brightness(1.2)" : "none",
      },
      selectField: {
        border: `2px solid ${theme === 'dark' ? '#9974bf' : '#6363ae'}`,
        backgroundColor: theme === 'dark' ? "#0D0D0D" : "#f9f9f9",
        color: theme === 'dark' ? "#ffffff" : "#111111",
      },
      inputFieldIconButton: {
        border: `2px solid ${theme === 'dark' ? '#9974bf' : '#6363ae'}`,
        color: theme === 'dark' ? "#9974bf" : "#6363ae",
      },
      selectButton: {
        border: "0px",
        color: theme === 'dark' ? "#ffffff" : "#111111",
      },
      formFieldInputShowPasswordButton: {
        border: "0px",
        color: theme === 'dark' ? "#aaaaaa" : "#333333",
        backgroundColor: "transparent",
        fontSize: "16px",
        opacity: 1,
      },
      footer: {
        display: "none",
      },
      developmentMode: {
        display: "none",
      },
      dividerText: {
        fontSize: "15px",
        color: theme === 'dark' ? "#ffffff" : "#111111",
      },
    },
  };

  return (
    <div>
      <div>
        {isSignUp ? (
          <SignUp 
            afterSignUpUrl='/home#dashboard' 
            appearance={customAppearance} 
          />
        ) : (
          <SignIn 
            afterSignInUrl={isSignedIn ? '/home#dashboard' : '/Signup'} 
            appearance={customAppearance} 
          />
        )}
      </div>
    </div>
  );
}

export default AuthComponent;
