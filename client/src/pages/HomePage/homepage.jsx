import { useUser } from "@clerk/clerk-react"; 
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/NavBar/navbar";
import Loading from "@/components/Loading/loading";
import Aurora from "@/components/Aurora/Aurora";
import RevenueCard from "@/components/ProfitCard/profitcard";
import WalletCard from "@/components/WalletCard/walletcard";
import MonthlyRevenueCard from "@/components/MonthlyRevenue/monthlyrevenuecard";
import Leaderboard from "@/components/Leaderboard/leaderboard";
import RecentEvents from "@/components/RecentEvents/RecentEvents";

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
        <Navbar imglink={''} />
        <div style={{ position: 'relative', minHeight: '110vh', overflow: 'hidden', backgroundColor: 'black',margin:0,paddingTop:120 }}>
          {/* Aurora in the background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <Aurora colorStops={["#2c5364", "#2c5364"]} blend={1} amplitude={0.2} speed={0.5} />
          </div>
      
          {/* Top Section */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              height: '50vh',
              padding: '100px 200px',
            }}
          >
            {/* Left side */}
            <div style={{ color: 'white', maxWidth: '600px' }}>
              <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Welcome Ebe,</h1>
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                Track your stats, manage entries, and explore events.
              </p>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#00f0ff',
                  color: 'black',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Get Started
              </button>
            </div>
      
            {/* Right side */}
            <div>
              <RevenueCard />
            </div>
          </div>
      
          {/* New Dashboard Section */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              padding: '0 200px 50px',
              marginTop: '-80px',
            }}
          >
            <WalletCard />
            <MonthlyRevenueCard />
            <Leaderboard />
            <RecentEvents />
          </div>
        </div>
      </>
      
    );
}

export default Homepage;
