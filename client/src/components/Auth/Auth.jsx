import { SignIn, SignUp } from "@clerk/clerk-react";


const customAppearance = {
    layout: {
      socialButtonsVariant: "iconButton", 
      showOptionalFields: false, 
      termsPageUrl: null, 
      privacyPageUrl: null, 
    },
    elements: {
      card: {
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(255, 0, 80, 0.5)",
        width: "30vw",
      },
      cardBox: {
        width: "30vw",
      },
      headerTitle: {
        color: "black",
        fontSize: "28px",
      },
      headerSubtitle: {
        fontSize: "20px",
        color: "black",
      },
      button: {
        border: "2px solid black",
      },
      inputField: {
        border: "2px solid black",
      },
      inputLabel: {
        fontSize: "22px",
        fontWeight: "bold",
        color: "black",
      },
      socialButtonsBlockButton: {
        border: "2px solid black",
      },
      socialButtonsIconButton: {
        border: "2px solid black",
      },
      selectField: {
        border: "2px solid black", 
      },
      inputFieldIconButton: {
        border: "2px solid black", 
      },
      selectButton:{
         border: "0px solid black"
      },
      formFieldInputShowPasswordButton:{
        border: "0px solid black"
      },
      footer: {
        display: "none",
      },
      developmentMode: {
        display: "none",
      },
      formFieldLabel:{
        fontSize:'15px'
      },
      dividerText:{
        fontSize:'15px'
      },
      input:{
        border: "0px solid black"
      }
    },
  };



function AuthComponent({ isSignUp }) {
  return (
    <div
    
    >
      <div
        style={{
         }}
      >
         {isSignUp?<SignUp appearance={customAppearance}  />:<SignIn appearance={customAppearance}  />}
      </div>
    </div>
  );
}

export default AuthComponent;
