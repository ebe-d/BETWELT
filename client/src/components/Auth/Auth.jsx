import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const customAppearance = {
  layout: {
    socialButtonsVariant: "iconButton",
    showOptionalFields: false,
    termsPageUrl: null,
    privacyPageUrl: null,
  },
  elements: {
    card: {
      backgroundColor: "#0D0D0D", // Pure black
      borderRadius: "12px",
      boxShadow: "0 0 20px rgba(0, 255, 198, 0.3)", // Soft cyan glow
      width: "30vw",
      border: "1px solid #00FFC6", // Neon Cyan border
      transition: "all 0.4s ease-in-out",
    },
    cardBox: {
      width: "30vw",
    },
    headerTitle: {
      color: "#00FFC6", // Neon Cyan
      fontSize: "28px",
      fontWeight: "bold",
      textShadow: "0 0 8px #00FFC6",
    },
    headerSubtitle: {
      fontSize: "20px",
      color: "#FFFFFF",
      fontWeight: "600",
      marginBottom: "10px",
    },
    formFieldLabel: {
      fontSize: "16px",
      color: "#FFFFFF",
      marginBottom: "6px",
      transition: "color 0.3s",
    },
    inputField: {
      border: "2px solid #00FFC6",
      backgroundColor: "#0D0D0D",
      color: "#FFFFFF",
      padding: "12px",
      borderRadius: "8px",
      transition: "all 0.3s ease-in-out",
    },
    inputField__focused: {
      border: "2px solid #00FFC6",
      boxShadow: "0 0 8px rgba(0, 255, 198, 0.6)",
    },
    inputField__invalid: {
      border: "2px solid #FF3B3B",
      boxShadow: "0 0 8px rgba(255, 59, 59, 0.6)",
    },
    inputLabel: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    input: {
      placeholderColor: "#AAAAAA",
      color: "#FFFFFF",
      backgroundColor: "transparent",
      fontSize: "16px",
    },
    button: {
      border: "2px solid #00FFC6",
      color: "#0D0D0D",
      backgroundColor: "#00FFC6",
      borderRadius: "8px",
      padding: "10px 20px",
      fontWeight: "bold",
      transition: "all 0.3s ease-in-out",
    },
    button__hover: {
      backgroundColor: "#00CC9F",
      borderColor: "#00CC9F",
      boxShadow: "0 0 10px rgba(0, 204, 159, 0.6)",
      transform: "translateY(-2px)",
    },
    socialButtonsBlockButton: {
      border: "2px solid #00FFC6",
      color: "#00FFC6",
      transition: "all 0.3s ease",
    },
    socialButtonsBlockButton__hover: {
      backgroundColor: "#00FFC6",
      color: "#0D0D0D",
    },
    socialButtonsIconButton: {
      border: "2px solidrgb(152, 212, 199)",
      color: "#00FFC6",
    },
    socialButtonsIconButton__hover: {
      backgroundColor: "#00FFC6",
      color: "#0D0D0D",
    },
    selectField: {
      border: "2px solid #00FFC6",
      backgroundColor: "#0D0D0D",
      color: "#FFFFFF",
    },
    inputFieldIconButton: {
      border: "2px solid #00FFC6",
      color: "#00FFC6",
    },
    selectButton: {
      border: "0px",
      color: "#FFFFFF",
    },
    formFieldInputShowPasswordButton: {
      border: "0px",
      color: "black",
    },
    footer: {
      display: "none",
    },
    developmentMode: {
      display: "none",
    },
    dividerText: {
      fontSize: "15px",
      color: "#FFFFFF",
    },
  },
};





function AuthComponent({ isSignUp }) {

  const navigate=useNavigate();
  const {isSignedIn}=useAuth();

  return (
    <div
    
    >
      <div
        style={{
         }}
      >
         {isSignUp?<SignUp afterSignUpUrl='/Home' appearance={customAppearance}  />:<SignIn afterSignInUrl={isSignedIn?'/Home':'/Signup'} appearance={customAppearance}  />}
      </div>
    </div>
  );
}

export default AuthComponent;
