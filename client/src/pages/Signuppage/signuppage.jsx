import './signuppage.css'
import AuthComponent from "../../components/Auth/Auth";


function SignUpPage(){
    return <>
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',width:'100vw'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}} id='brand'>
        <div>
        <span className="logo">BET</span>
        <span className="logo2">WELT</span>
        </div>
        <AuthComponent isSignUp={true}/>
        </div>
    </div>
    </>
}

export default SignUpPage