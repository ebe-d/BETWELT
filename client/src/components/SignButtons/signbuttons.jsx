import '/src/components/SignButtons/signbuttons.css';

function SignButtons({label,text,onClick}){
    return <>
            <div id="buttons" style={{ 
                        display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop:10 
                    }}>
                        
                       {label?<div style={{ 
                            fontSize: '14px', color: '', marginTop: 16 , marginBottom:16
                        }}>
                            <span style={{color: 'grey'}}>{label}</span>
                        </div>:null}

                    
                        <button onClick={onClick} style={{ width: 200,marginTop:-10 }} className="SignUp-button">
                            <span>{text}</span>
                        </button>


                    </div>
    </>
}


export default SignButtons