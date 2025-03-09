import { useUser } from "@clerk/clerk-react"; 
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar/navbar";
import Loading from "@/components/Loading/loading";
import Aurora from "@/components/Aurora/Aurora";

function Homepage() {
    const { isSignedIn, isLoaded, user } = useUser(); 
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false); // Step 3

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            navigate("/signup");
        }
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
        if (isSignedIn && user) {
            const checkUser = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/users/profile`, {
                        method: "GET",
                        credentials: "include",
                    });

                    const data = await response.json();

                    if (response.ok && data.user) {
                        setIsRegistered(true);
                    } else {
                        setIsRegistered(false);
                    }
                } catch (err) {
                    console.error(err);
                    setIsRegistered(false);
                }
            };
            checkUser();
        }
    }, [isSignedIn, user]);

    useEffect(() => {
        if (isSignedIn && isRegistered === false) {
            const registerUser = async () => {
                try {
                    const response = await fetch("http://localhost:5000/api/users/register", {
                        method: "POST",
                        credentials: "include",
                    });

                    const data = await response.json();
                    console.log(data);
                    setIsRegistered(true);
                } catch (err) {
                    console.error(err);
                }
            };
            registerUser();
        }
    }, [isSignedIn, isRegistered]);

    if (!isLoaded) {
        return <Loading></Loading>;
    }
    

    return (
        <>
        <Navbar />
        <div style={{backgroundColor:'black',height:'100vh'}}>
        <Aurora
        colorStops={["#19c4e6", "#7cff67"]}
        blend={4}
        amplitude={0.2}
        speed={0.5}
        />
        </div>
    </>
    );
}

export default Homepage;
