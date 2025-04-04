import { useUser } from "@clerk/clerk-react"; 
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import styles from './homepage.module.css';
import Navbar from "../../components/NavBar/navbar";
import Loading from "@/components/Loading/loading";
import Aurora from "@/components/Aurora/Aurora";
import axios from "axios";
import { toast } from "react-hot-toast";

function Homepage() {
    const { isSignedIn, isLoaded, user } = useUser(); 
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [walletBalance, setWalletBalance] = useState(2890);
    const [ongoingMatches, setOngoingMatches] = useState([
        {
            id: 1,
            event: "Premier League",
            match: "Liverpool vs Manchester City",
            betAmount: 150,
            odds: 2.35,
            potentialReturn: 352.5,
            status: "In Progress",
            progress: "65'",
            score: "1-1",
            endTime: "45 mins remaining",
            statusColor: "green"
        },
        {
            id: 2,
            event: "NBA",
            match: "Lakers vs Warriors",
            betAmount: 200,
            odds: 1.95,
            potentialReturn: 390,
            status: "Final Quarter",
            progress: "Q4",
            score: "98-102",
            endTime: "8 mins remaining",
            statusColor: "green"
        },
        {
            id: 3,
            event: "Tennis - Wimbledon",
            match: "Djokovic vs Nadal",
            betAmount: 120,
            odds: 2.10,
            potentialReturn: 252,
            status: "In Progress",
            progress: "Set 3",
            score: "1-1",
            endTime: "30 mins remaining",
            statusColor: "green"
        },
        {
            id: 4,
            event: "Formula 1",
            match: "Monaco Grand Prix - Hamilton",
            betAmount: 75,
            odds: 3.20,
            potentialReturn: 240,
            status: "Final Laps",
            progress: "Lap 68/78",
            score: "P1",
            endTime: "12 mins remaining",
            statusColor: "green"
        },
        {
            id: 5,
            event: "UFC",
            match: "McGregor vs Poirier",
            betAmount: 180,
            odds: 1.75,
            potentialReturn: 315,
            status: "Round 2",
            progress: "R2",
            score: "—",
            endTime: "3 mins remaining",
            statusColor: "green"
        }
    ]);
    const [showAllMatches, setShowAllMatches] = useState(false);
    const [showAllBettingHistory, setShowAllBettingHistory] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [activeTab, setActiveTab] = useState('latest');
    const [showAllCommunityItems, setShowAllCommunityItems] = useState(false);
    const [userBets, setUserBets] = useState([]);
    
    // Betting history data
    const [bettingHistory, setBettingHistory] = useState([
        {
            id: 1,
            event: "Premier League",
            match: "Arsenal vs Chelsea",
            date: "2023-10-15",
            betAmount: 100,
            odds: 2.1,
            result: "win",
            payout: 210,
            profit: 110,
            category: "Soccer"
        },
        {
            id: 2,
            event: "NBA",
            match: "Celtics vs Knicks",
            date: "2023-10-12",
            betAmount: 150,
            odds: 1.8,
            result: "loss",
            payout: 0,
            profit: -150,
            category: "Basketball"
        },
        {
            id: 3,
            event: "UFC 290",
            match: "Adesanya vs Pereira",
            date: "2023-10-10",
            betAmount: 200,
            odds: 1.65,
            result: "win",
            payout: 330,
            profit: 130,
            category: "MMA"
        },
        {
            id: 4,
            event: "Wimbledon",
            match: "Alcaraz vs Sinner",
            date: "2023-10-07",
            betAmount: 120,
            odds: 2.3,
            result: "win",
            payout: 276,
            profit: 156,
            category: "Tennis"
        },
        {
            id: 5,
            event: "F1 Grand Prix",
            match: "Monaco - Verstappen",
            date: "2023-10-05",
            betAmount: 180,
            odds: 1.5,
            result: "loss",
            payout: 0,
            profit: -180,
            category: "Motorsport"
        }
    ]);
    
    // Performance metrics
    const [perfMetrics, setPerfMetrics] = useState({
        totalBets: 25,
        winRate: 68,
        avgOdds: 1.95,
        bestCategory: "Tennis",
        bestCategoryWinRate: 82,
        profitLossRatio: 2.3,
        netProfit: 1240,
        monthlySummary: [
            { month: 'Jun', wins: 5, losses: 2, profit: 310 },
            { month: 'Jul', wins: 6, losses: 3, profit: 420 },
            { month: 'Aug', wins: 7, losses: 2, profit: 560 },
            { month: 'Sep', wins: 4, losses: 3, profit: 250 },
            { month: 'Oct', wins: 5, losses: 1, profit: 400 },
        ],
        categorySummary: [
            { category: 'Soccer', winRate: 74, totalBets: 8, netProfit: 450 },
            { category: 'Basketball', winRate: 62, totalBets: 6, netProfit: 280 },
            { category: 'Tennis', winRate: 82, totalBets: 5, netProfit: 320 },
            { category: 'MMA', winRate: 70, totalBets: 4, netProfit: 210 },
            { category: 'Motorsport', winRate: 50, totalBets: 2, netProfit: -20 }
        ]
    });

    // Number of matches to show initially
    const visibleMatchCount = 3;
    const visibleHistoryCount = 3;
    const visibleCategoryCount = 3;
    const visibleCommunityCount = 3;
    
    // Get content for the current community tab
    const getCommunityItems = () => {
        switch(activeTab) {
            case 'latest':
                return [
                    { id: 1, type: 'news' },
                    { id: 2, type: 'news' },
                    { id: 3, type: 'news' },
                    { id: 4, type: 'news' },
                    { id: 5, type: 'news' }
                ];
            case 'predictions':
                return [
                    { id: 1, type: 'prediction' },
                    { id: 2, type: 'prediction' },
                    { id: 3, type: 'prediction' },
                    { id: 4, type: 'prediction' }
                ];
            case 'discussions':
                return [
                    { id: 1, type: 'discussion' },
                    { id: 2, type: 'discussion' },
                    { id: 3, type: 'discussion' },
                    { id: 4, type: 'discussion' }
                ];
            case 'polls':
                return [
                    { id: 1, type: 'poll' },
                    { id: 2, type: 'poll' },
                    { id: 3, type: 'poll' },
                    { id: 4, type: 'poll' }
                ];
            default:
                return [];
        }
    };
    
    // Get community items for current tab
    const communityItems = getCommunityItems();
    
    // Filter community items based on showAllCommunityItems state
    const displayedCommunityItems = showAllCommunityItems 
        ? communityItems 
        : communityItems.slice(0, visibleCommunityCount);

    // Filter matches based on showAllMatches state
    const displayedMatches = showAllMatches 
        ? ongoingMatches 
        : ongoingMatches.slice(0, visibleMatchCount);
        
    // Filter betting history based on showAllBettingHistory state
    const displayedBettingHistory = showAllBettingHistory
        ? bettingHistory
        : bettingHistory.slice(0, visibleHistoryCount);
        
    // Filter categories based on showAllCategories state
    const displayedCategories = showAllCategories
        ? perfMetrics.categorySummary
        : perfMetrics.categorySummary.slice(0, visibleCategoryCount);

    // Toggle function for show more/less
    const toggleShowMatches = () => {
        setShowAllMatches(!showAllMatches);
    };
    
    // Toggle function for betting history
    const toggleShowBettingHistory = () => {
        setShowAllBettingHistory(!showAllBettingHistory);
    };
    
    // Toggle function for categories
    const toggleShowCategories = () => {
        setShowAllCategories(!showAllCategories);
    };

    // Toggle function for community items
    const toggleShowCommunityItems = () => {
        setShowAllCommunityItems(!showAllCommunityItems);
    };

    // Theme toggle handler
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Dispatch a custom event for other components to detect the theme change
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    };

    // Set initial theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

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

    // Add these new state variables
    const [spinAvailable, setSpinAvailable] = useState(false);
    const [countdown, setCountdown] = useState({ hours: 4, minutes: 23, seconds: 12 });
    
    // Add these new state variables for scratch cards
    const [scratchCardsAvailable, setScratchCardsAvailable] = useState(true);
    const [scratchCardsCount, setScratchCardsCount] = useState(2);
    const [scratchCountdown, setScratchCountdown] = useState({ hours: 7, minutes: 45, seconds: 30 });
    const [claimedCards, setClaimedCards] = useState({});

    // Add an useEffect to handle the countdown timer
    useEffect(() => {
        if (countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0) {
            setSpinAvailable(true);
            return;
        }
        
        const timer = setTimeout(() => {
            let newHours = countdown.hours;
            let newMinutes = countdown.minutes;
            let newSeconds = countdown.seconds - 1;
            
            if (newSeconds < 0) {
                newSeconds = 59;
                newMinutes -= 1;
            }
            
            if (newMinutes < 0) {
                newMinutes = 59;
                newHours -= 1;
            }
            
            setCountdown({ hours: newHours, minutes: newMinutes, seconds: newSeconds });
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [countdown]);

    // Add a function to format the countdown time
    const formatCountdown = () => {
        return `${countdown.hours}:${countdown.minutes.toString().padStart(2, '0')}:${countdown.seconds.toString().padStart(2, '0')}`;
    };

    // Add a function to handle the claim button click
    const handleClaimNow = () => {
        if (!spinAvailable) return;
        
        // Reset the countdown after claiming
        setCountdown({ hours: 23, minutes: 59, seconds: 59 });
        setSpinAvailable(false);
        
        // Call the spin wheel function
        spinTheWheel();
    };

    // Replace the spinTheWheel function with this updated version
    const spinTheWheel = () => {
        const wheel = document.getElementById('spinWheel');
        if (!wheel) return;
        
        // Disable the spin button during spin
        const button = wheel.querySelector(`.${styles.spinButton}`);
        if (button) button.disabled = true;
        
        // Generate random spin between 2-5 full rotations plus a random segment
        const segments = 6; // 6 segments in our wheel
        const randomSegment = Math.floor(Math.random() * segments);
        const rotations = 2 + Math.floor(Math.random() * 3); // 2-4 full rotations
        const degrees = (rotations * 360) + (randomSegment * (360 / segments));
        
        // Apply spinning animation
        wheel.style.transition = 'transform 3s cubic-bezier(0.1, 0.25, 0.1, 1)';
        wheel.style.transform = `perspective(800px) rotateY(15deg) rotate(${degrees}deg)`;
        
        // Show result after animation ends
        setTimeout(() => {
            // Get the winning segment (could be used to determine prize)
            const winningSegment = segments - (randomSegment % segments);
            
            // Show a message about the winnings
            alert(`Congratulations! You won prize ${winningSegment}!`);
            
            // Reset wheel for next spin after a delay
            setTimeout(() => {
                wheel.style.transition = 'none';
                wheel.style.transform = 'perspective(800px) rotateY(15deg)';
                
                // Re-enable the button
                if (button) button.disabled = false;
            }, 1000);
        }, 3000);
    };

    // Add an useEffect to handle the scratch card countdown timer
    useEffect(() => {
        if (scratchCountdown.hours === 0 && scratchCountdown.minutes === 0 && scratchCountdown.seconds === 0) {
            setScratchCardsAvailable(true);
            setScratchCardsCount(prevCount => prevCount + 1); // Add a new card every time the timer resets
            return;
        }
        
        const timer = setTimeout(() => {
            let newHours = scratchCountdown.hours;
            let newMinutes = scratchCountdown.minutes;
            let newSeconds = scratchCountdown.seconds - 1;
            
            if (newSeconds < 0) {
                newSeconds = 59;
                newMinutes -= 1;
            }
            
            if (newMinutes < 0) {
                newMinutes = 59;
                newHours -= 1;
            }
            
            setScratchCountdown({ hours: newHours, minutes: newMinutes, seconds: newSeconds });
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [scratchCountdown]);

    // Add a function to format the scratch countdown time
    const formatScratchCountdown = () => {
        return `${scratchCountdown.hours}:${scratchCountdown.minutes.toString().padStart(2, '0')}:${scratchCountdown.seconds.toString().padStart(2, '0')}`;
    };

    // Update the existing handleScratchReveal function
    const handleScratchReveal = (e, cardId) => {
        // If card already claimed, do nothing
        if (claimedCards[cardId]) return;
        
        const target = e.currentTarget;
        const card = target.querySelector(`.${styles.scratchCardFront}`);
        
        if (!card) return;
        
        // Apply scratched effect and start reveal animation
        card.style.transition = 'transform 0.6s ease';
        card.style.transform = 'rotateY(180deg)';
        
        // Get the back card and animate it
        const backCard = target.querySelector(`.${styles.scratchCardBack}`);
        if (backCard) {
            backCard.style.transition = 'transform 0.6s ease';
            backCard.style.transform = 'rotateY(0deg)';
            
            // Add confetti effect after card is revealed
            setTimeout(() => {
                backCard.style.animation = 'fadeScale 0.5s';
                
                // Mark the card as claimed after it's revealed
                setTimeout(() => {
                    // Update the claimed cards state
                    setClaimedCards(prev => ({...prev, [cardId]: true}));
                    
                    // Reduce the available scratch card count
                    setScratchCardsCount(prevCount => Math.max(0, prevCount - 1));
                    
                    // If all cards are claimed, start the countdown for the next batch
                    if (scratchCardsCount === 1) {
                        setScratchCardsAvailable(false);
                        setScratchCountdown({ hours: 23, minutes: 59, seconds: 59 });
                    }
                }, 1500);
            }, 600);
        }
    };

    // Add this somewhere in your component before the return statement
    const scratch1Ref = useRef(null);
    const scratch2Ref = useRef(null);

    // Fetch user predictions
    useEffect(() => {
        const fetchUserPredictions = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/predictions`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserBets(response.data);
            } catch (error) {
                console.error('Error fetching user predictions:', error);
                toast.error('Failed to load your predictions');
            }
        };

        if (isSignedIn) {
            fetchUserPredictions();
        }
    }, [isSignedIn]);

    if (!isLoaded) {
        return <Loading />;
    }

    return (
        <>
            <Navbar imglink={user?.imageUrl || ''} walletBalance={walletBalance} />
            <main className={styles.container}>
                <div className={styles.auroraWrapper}>
                    <Aurora 
                        colorStops={theme === 'dark' ? ["#1a1a1a", "#0d0d0d", "#000000"] : ["#ffffff", "#f0f0f0", "#e0e0e0"]} 
                        blend={1} 
                        amplitude={0.2} 
                        speed={0.3} 
                    />
                </div>

                <div className={styles.mainContent}>
                    <section className={styles.welcomeSection}>
                        <h1 className={styles.welcomeTitle}>
                            Welcome to Predixor, {user?.firstName || 'Ebenezer'}
                        </h1>
                        <p className={styles.welcomeText}>
                            Make informed decisions with real-time analytics and AI-powered insights. 
                            Track your performance and stay ahead of the game.
                        </p>
                    </section>

                    {/* Dashboard content */}
                    <div className={styles.dashboardContainer}>
                        {/* User Predictions Section */}
                        <section className={`${styles.userPredictionsSection} ${styles.welcomeSection}`}>
                            <div className={styles.sectionHeader}>
                                <h2>My Predictions</h2>
                                <div className={styles.headerActions}>
                                    <button className={styles.viewAllButton} onClick={() => navigate('/home/events')}>
                                        View All Events
                                    </button>
                                </div>
                            </div>
                            
                            <div className={styles.predictionsGrid}>
                                {userBets.length > 0 ? (
                                    userBets.map((bet, index) => (
                                        <div key={index} className={styles.predictionCard}>
                                            <div className={styles.predictionHeader}>
                                                <h3>{bet.eventName}</h3>
                                                <span className={styles.predictionStatus}>{bet.status || 'Active'}</span>
                                            </div>
                                            <div className={styles.predictionDetails}>
                                                <div className={styles.predictionSelection}>
                                                    <span className={styles.label}>Selection:</span>
                                                    <span className={styles.value}>{bet.selectionName}</span>
                                                </div>
                                                <div className={styles.predictionAmount}>
                                                    <span className={styles.label}>Amount:</span>
                                                    <span className={styles.value}>{bet.amount} PDX</span>
                                                </div>
                                                <div className={styles.predictionOdds}>
                                                    <span className={styles.label}>Odds:</span>
                                                    <span className={styles.value}>{bet.odds}</span>
                                                </div>
                                                <div className={styles.predictionPayout}>
                                                    <span className={styles.label}>Potential Payout:</span>
                                                    <span className={styles.value}>{bet.potentialPayout} PDX</span>
                                                </div>
                                            </div>
                                            <div className={styles.predictionFooter}>
                                                <span className={styles.predictionDate}>
                                                    {new Date(bet.timestamp).toLocaleDateString()}
                                                </span>
                                                <button 
                                                    className={styles.viewDetailsButton}
                                                    onClick={() => navigate(`/home/events/${bet.eventId}`)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noPredictions}>
                                        <p>You haven't placed any predictions yet.</p>
                                        <button 
                                            className={styles.placePredictionButton}
                                            onClick={() => navigate('/home/events')}
                                        >
                                            Place Your First Prediction
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Ongoing Matches Section */}
                        <section className={`${styles.ongoingMatchesSection} ${styles.welcomeSection}`}>
                            <header className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    Ongoing Matches
                                </h2>
                            </header>
                            
                            <div className={styles.matchesContainer}>
                                {ongoingMatches.length === 0 ? (
                                    <div className={styles.noMatches}>
                                        <p>You don't have any ongoing matches at the moment.</p>
                                        <button className={styles.exploreButton}>Explore Events</button>
                                    </div>
                                ) : (
                                    <div className={styles.matchesList}>
                                        {displayedMatches.map((match, index) => (
                                            <div className={styles.matchRow} key={match.id} style={{"--delay": `${0.1 + index * 0.1}s`}}>
                                                <div className={styles.matchInfo}>
                                                    <div className={styles.matchHeader}>
                                                        <span className={styles.eventName}>{match.event}</span>
                                                        <div className={`${styles.liveIndicator} ${styles.pulse}`}>
                                                            <span className={styles.liveStatus} 
                                                                style={{ '--status-color': match.statusColor === 'green' ? 'var(--status-live)' : 'var(--negative-color)' }}>
                                                                {match.status}
                                                            </span>
                                                            <span className={styles.matchProgress}>{match.progress}</span>
                                                        </div>
                                                    </div>
                                                    <h3 className={styles.matchTitle}>{match.match}</h3>
                                                    <div className={styles.matchDetails}>
                                                        <div className={styles.matchScore}>{match.score}</div>
                                                        <div className={styles.matchTime}>{match.endTime}</div>
                                                    </div>
                                                </div>
                                                <div className={styles.betInfo}>
                                                    <div className={styles.betDetails}>
                                                        <div className={styles.betStat}>
                                                            <span className={styles.statAmount}>{match.betAmount} PDX</span>
                                                            <span className={styles.statLabel}>Stake</span>
                                                        </div>
                                                        <div className={styles.betStat}>
                                                            <span className={styles.statAmount}>{match.odds}</span>
                                                            <span className={styles.statLabel}>Odds</span>
                                                        </div>
                                                        <div className={styles.betStat}>
                                                            <span className={styles.statAmount}>{match.potentialReturn} PDX</span>
                                                            <span className={styles.statLabel}>Potential Return</span>
                                                        </div>
                                                    </div>
                                                    <button className={styles.watchButton}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                        Watch Live
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {ongoingMatches.length > visibleMatchCount && (
              <button
                                                className={styles.showMoreButton} 
                                                onClick={toggleShowMatches}
                                            >
                                                {showAllMatches ? 'Show Less' : 'Show More'}
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    viewBox="0 0 24 24" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    strokeWidth="2" 
                                                    className={showAllMatches ? styles.rotateIcon : ''}
                                                >
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
              </button>
                                        )}
                                    </div>
                                )}
            </div>
                        </section>

                        {/* Betting History & Performance Analytics Section */}
                        <section className={`${styles.bettingHistorySection} ${styles.welcomeSection}`}>
                            <header className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20V10"></path>
                                        <path d="M18 20V4"></path>
                                        <path d="M6 20v-6"></path>
                                    </svg>
                                    Betting History & Performance
                                </h2>
                            </header>

                            <div className={styles.performanceSummary}>
                                <div className={styles.performanceMetrics}>
                                    <div className={styles.metricCard}>
                                        <div className={styles.metricValue}>{perfMetrics.winRate}%</div>
                                        <div className={styles.metricLabel}>Win Rate</div>
                                    </div>
                                    <div className={styles.metricCard}>
                                        <div className={styles.metricValue}>{perfMetrics.totalBets}</div>
                                        <div className={styles.metricLabel}>Total Bets</div>
                                    </div>
                                    <div className={styles.metricCard}>
                                        <div className={styles.metricValue}>{perfMetrics.netProfit > 0 ? '+' : ''}{perfMetrics.netProfit} PDX</div>
                                        <div className={styles.metricLabel}>Net Profit</div>
                                    </div>
                                    <div className={styles.metricCard}>
                                        <div className={styles.metricValue}>{perfMetrics.bestCategory}</div>
                                        <div className={styles.metricLabel}>Best Category</div>
                                    </div>
            </div>

                                <div className={styles.winRateContainer}>
                                    <div className={styles.winRateCircle} style={{ "--win-percentage": `${perfMetrics.winRate}%` }}>
                                        <div className={styles.winRateInner}>
                                            <span>{perfMetrics.winRate}%</span>
                                            <small>Success Rate</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.analyticsContainer}>
                                <div className={styles.analyticsHeader}>
                                    <h3>Monthly Performance</h3>
                                </div>
                                <div className={styles.chartContainer}>
                                    <div className={styles.lineChart}>
                                        <div className={styles.yAxis}>
                                            <div className={styles.yAxisLine}></div>
                                            <div className={styles.yAxisLabel}>600</div>
                                            <div className={styles.yAxisLabel}>400</div>
                                            <div className={styles.yAxisLabel}>200</div>
                                            <div className={styles.yAxisLabel}>0</div>
                                        </div>
                                        <div className={styles.chartContent}>
                                            <svg 
                                                className={styles.lineGraph} 
                                                viewBox="0 0 500 200" 
                                                preserveAspectRatio="none"
                                            >
                                                <polyline 
                                                    className={styles.profitLine}
                                                    points="
                                                        0,140 
                                                        100,110 
                                                        200,70 
                                                        300,120 
                                                        400,80
                                                        500,60
                                                    "
                                                    stroke="var(--accent-primary)" 
                                                    fill="none" 
                                                />
                                                <path 
                                                    className={styles.profitArea}
                                                    d="
                                                        M0,140 
                                                        L100,110 
                                                        L200,70 
                                                        L300,120 
                                                        L400,80
                                                        L500,60
                                                        L500,200 
                                                        L0,200 
                                                        Z
                                                    "
                                                    fill="url(#profitGradient)"
                                                />
                                                <defs>
                                                    <linearGradient id="profitGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.5" />
                                                        <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.1" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className={styles.xAxis}>
                                                {perfMetrics.monthlySummary.map((month) => (
                                                    <div key={month.month} className={styles.xAxisLabel}>
                                                        <span>{month.month}</span>
                                                        <span className={styles.profitLabel}>{month.profit > 0 ? '+' : ''}{month.profit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
            </div>
          </div>
      
                            <div className={styles.categoryPerformance}>
                                <div className={styles.analyticsHeader}>
                                    <h3>Category Performance</h3>
                                </div>
                                <div className={styles.categoryList}>
                                    {displayedCategories.map((category, index) => (
                                        <div className={styles.categoryItem} key={category.category} style={{ "--delay": `${0.1 + index * 0.1}s`, marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                                            <div className={styles.categoryHeader}>
                                                <div className={styles.categoryName}>{category.category}</div>
                                                <div className={styles.categoryWinRate}>{category.winRate}% Win Rate</div>
                                            </div>
                                            <div className={styles.progressContainer}>
                                                <div 
                                                    className={styles.progressBar} 
                                                    style={{ width: `${category.winRate}%` }}
                                                ></div>
                                            </div>
                                            <div className={styles.categoryFooter}>
                                                <div className={styles.categoryBets}>{category.totalBets} bets</div>
                                                <div className={`${styles.categoryProfit} ${category.netProfit >= 0 ? styles.profit : styles.loss}`}>
                                                    {category.netProfit > 0 ? '+' : ''}{category.netProfit} PDX
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {perfMetrics.categorySummary.length > visibleCategoryCount && (
                                        <button 
                                            className={styles.showMoreButton}
                                            onClick={toggleShowCategories}
                                        >
                                            {showAllCategories ? 'Show Less' : 'Show More'}
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                strokeWidth="2"
                                                className={showAllCategories ? styles.rotateIcon : ''}
                                            >
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className={styles.bettingHistoryList}>
                                <div className={styles.analyticsHeader}>
                                    <h3>Recent Betting Activity</h3>
                                </div>
                                {displayedBettingHistory.map((bet, index) => (
                                    <div className={`${styles.historyRow} ${bet.result === 'win' ? styles.winRow : styles.lossRow}`} key={bet.id} style={{ "--delay": `${0.1 + index * 0.1}s` }}>
                                        <div className={styles.historyIndicator}></div>
                                        <div className={styles.historyContent}>
                                            <div className={styles.historyMain}>
                                                <div className={styles.historyInfo}>
                                                    <h4 className={styles.historyTitle}>{bet.match}</h4>
                                                    <div className={styles.historyMeta}>
                                                        <span className={styles.historyEvent}>{bet.event}</span>
                                                        <span className={styles.historyCategory}>{bet.category}</span>
                                                        <span className={styles.historyDate}>{bet.date}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.historyStats}>
                                                    <div className={styles.historyStat}>
                                                        <span className={styles.historyStatValue}>{bet.betAmount} PDX</span>
                                                        <span className={styles.historyStatLabel}>Stake</span>
                                                    </div>
                                                    <div className={styles.historyStat}>
                                                        <span className={styles.historyStatValue}>{bet.odds}</span>
                                                        <span className={styles.historyStatLabel}>Odds</span>
                                                    </div>
                                                    <div className={styles.historyStat}>
                                                        <span className={styles.historyStatValue}>{bet.payout} PDX</span>
                                                        <span className={styles.historyStatLabel}>Payout</span>
                                                    </div>
                                                    <div className={`${styles.historyStat} ${bet.profit >= 0 ? styles.profitStat : styles.lossStat}`}>
                                                        <span className={styles.historyStatValue}>{bet.profit > 0 ? '+' : ''}{bet.profit} PDX</span>
                                                        <span className={styles.historyStatLabel}>Profit/Loss</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.historyResult}>
                                                <span className={`${styles.resultBadge} ${bet.result === 'win' ? styles.winBadge : styles.lossBadge}`}>
                                                    {bet.result === 'win' ? 'WIN' : 'LOSS'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    className={styles.showMoreButton}
                                    onClick={toggleShowBettingHistory}
                                >
                                    {showAllBettingHistory ? 'Show Less' : 'Show More'}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                        className={showAllBettingHistory ? styles.rotateIcon : ''}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </section>
                        
                        {/* Community News & Discussion Forum Section */}
                        <section className={`${styles.communitySection} ${styles.welcomeSection}`}>
                            <header className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                    </svg>
                                    Community News & Discussion Forum
                                </h2>
                            </header>
                            
                            <div className={styles.communityTabContainer}>
                                <div className={styles.communityTabs}>
                                    <button 
                                        className={`${styles.communityTab} ${activeTab === 'latest' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('latest')}
                                    >
                                        Latest News
                                    </button>
                                    <button 
                                        className={`${styles.communityTab} ${activeTab === 'predictions' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('predictions')}
                                    >
                                        Predictions
                                    </button>
                                    <button 
                                        className={`${styles.communityTab} ${activeTab === 'discussions' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('discussions')}
                                    >
                                        Discussions
                                    </button>
                                    <button 
                                        className={`${styles.communityTab} ${activeTab === 'polls' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('polls')}
                                    >
                                        Polls
                                    </button>
                                </div>
                                
                                <div className={styles.communityContent}>
                                    {/* Latest News - Only show when Latest tab is active */}
                                    {activeTab === 'latest' && (
                                        <div className={styles.newsContainer}>
                                            {displayedCommunityItems.map((item, index) => (
                                                <div className={styles.newsItem} key={item.id} style={{ "--delay": `${0.1 + index * 0.1}s` }}>
                                                    <div className={styles.newsHeader}>
                                                        <div className={styles.newsCategory}>
                                                            {index === 0 ? 'Premier League' : index === 1 ? 'NBA' : 'Formula 1'}
                                                        </div>
                                                        <div className={styles.newsTimestamp}>
                                                            {index === 0 ? '2 hours ago' : index === 1 ? '5 hours ago' : 'Yesterday'}
                                                        </div>
                                                    </div>
                                                    <h3 className={styles.newsTitle}>
                                                        {index === 0 
                                                            ? 'Manchester United confirms new signing ahead of derby clash' 
                                                            : index === 1 
                                                            ? 'Lakers star sidelined with injury ahead of crucial playoff game' 
                                                            : 'Formula 1 announces new race for next season'}
                                                    </h3>
                                                    <p className={styles.newsExcerpt}>
                                                        {index === 0 
                                                            ? "The Red Devils have officially announced the acquisition of the Brazilian midfielder from Monaco on a five-year deal with an option to extend..." 
                                                            : index === 1
                                                            ? "The team's leading scorer will miss at least two weeks with a hamstring strain, potentially impacting their championship aspirations..."
                                                            : "Officials have confirmed a new street circuit will join the calendar next season, bringing the total number of races to a record high..."}
                                                    </p>
                                                    <div className={styles.newsFooter}>
                                                        <div className={styles.newsEngagement}>
                                                            <button className={styles.engagementButton}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                                                </svg>
                                                                <span>{128 - (index * 20)}</span>
                                                            </button>
                                                            <button className={styles.engagementButton}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                                </svg>
                                                                <span>{43 - (index * 6)}</span>
                                                            </button>
                                                        </div>
                                                        <a href="#" className={styles.readMoreLink}>
                                                            Read More
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                <polyline points="12 5 19 12 12 19"></polyline>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Predictions tab content */}
                                    {activeTab === 'predictions' && (
                                        <div className={styles.newsContainer}>
                                            {displayedCommunityItems.map((item, index) => (
                                                <div className={styles.newsItem} key={item.id} style={{ "--delay": `${0.1 + index * 0.1}s` }}>
                                                    <div className={styles.newsHeader}>
                                                        <div className={styles.newsPrediction}>Expert Prediction</div>
                                                        <div className={styles.newsTimestamp}>{index === 0 ? 'Yesterday' : '2 days ago'}</div>
                                                    </div>
                                                    <h3 className={styles.newsTitle}>
                                                        {index === 0 
                                                            ? 'Formula 1 Monaco GP: Expert analysis and predictions' 
                                                            : 'EPL Weekend: Why Arsenal might upset Manchester City'}
                                                    </h3>
                                                    <p className={styles.newsExcerpt}>
                                                        {index === 0 
                                                            ? "Our F1 expert breaks down why Verstappen remains the favorite, but Hamilton's recent form and history at Monaco makes him a value bet at current odds..." 
                                                            : "Despite City's dominance, Arsenal's tactical setup and recent form could lead to a surprise result at the Etihad Stadium this weekend..."}
                                                    </p>
                                                    <div className={styles.predictorInfo}>
                                                        <div className={styles.predictorAvatar}>
                                                            <img src={`https://randomuser.me/api/portraits/${index === 0 ? 'men/32' : 'women/44'}.jpg`} alt="Predictor" />
                                                        </div>
                                                        <div className={styles.predictorStats}>
                                                            <div className={styles.predictorName}>{index === 0 ? 'Michael Thompson' : 'Sarah Wilson'}</div>
                                                            <div className={styles.predictorAccuracy}>{index === 0 ? '76%' : '81%'} accuracy | {index === 0 ? 'F1 Specialist' : 'Premier League Expert'}</div>
                                                        </div>
                                                    </div>
                                                    <div className={styles.newsFooter}>
                                                        <div className={styles.newsEngagement}>
                                                            <button className={styles.engagementButton}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                                                </svg>
                                                                <span>{index === 0 ? '215' : '176'}</span>
                                                            </button>
                                                            <button className={styles.engagementButton}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                                </svg>
                                                                <span>{index === 0 ? '87' : '63'}</span>
                                                            </button>
                                                        </div>
                                                        <a href="#" className={styles.readMoreLink}>
                                                            Read More
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                <polyline points="12 5 19 12 12 19"></polyline>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Discussions tab content */}
                                    {activeTab === 'discussions' && (
                                        <div className={styles.newsContainer}>
                                            <div className={styles.newsItem} style={{ "--delay": "0.1s" }}>
                                                <div className={styles.newsHeader}>
                                                    <div className={styles.newsCategory}>Hot Topic</div>
                                                    <div className={styles.newsTimestamp}>3 hours ago</div>
                                                </div>
                                                <h3 className={styles.newsTitle}>VAR controversy: Is technology improving football or ruining it?</h3>
                                                <p className={styles.newsExcerpt}>
                                                    After another weekend of controversial decisions, fans and experts debate 
                                                    whether VAR is helping or hurting the beautiful game...
                                                </p>
                                                <div className={styles.newsFooter}>
                                                    <div className={styles.newsEngagement}>
                                                        <button className={styles.engagementButton}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                                            </svg>
                                                            <span>342</span>
                                                        </button>
                                                        <button className={styles.engagementButton}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                            </svg>
                                                            <span>128</span>
                                                        </button>
                                                    </div>
                                                    <a href="#" className={styles.readMoreLink}>
                                                        Join Discussion
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                                            <polyline points="12 5 19 12 12 19"></polyline>
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.newsItem} style={{ "--delay": "0.2s" }}>
                                                <div className={styles.newsHeader}>
                                                    <div className={styles.newsCategory}>Strategy Talk</div>
                                                    <div className={styles.newsTimestamp}>Yesterday</div>
                                                </div>
                                                <h3 className={styles.newsTitle}>Bankroll management strategies that actually work</h3>
                                                <p className={styles.newsExcerpt}>
                                                    Community members share their most effective bankroll management techniques 
                                                    and how they've improved their long-term betting success...
                                                </p>
                                                <div className={styles.newsFooter}>
                                                    <div className={styles.newsEngagement}>
                                                        <button className={styles.engagementButton}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                                            </svg>
                                                            <span>203</span>
                                                        </button>
                                                        <button className={styles.engagementButton}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                            </svg>
                                                            <span>96</span>
                                                        </button>
                                                    </div>
                                                    <a href="#" className={styles.readMoreLink}>
                                                        Join Discussion
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                                            <polyline points="12 5 19 12 12 19"></polyline>
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Polls tab content */}
                                    {activeTab === 'polls' && (
                                        <div className={styles.pollsContainer}>
                                            {displayedCommunityItems.map((item, index) => (
                                                <div className={styles.pollContainer} key={item.id} style={{ "--delay": `${0.1 + index * 0.1}s` }}>
                                                    <h3 className={styles.pollTitle}>
                                                        {index === 0 
                                                            ? 'Which team will win the Champions League this season?' 
                                                            : index === 1 
                                                            ? 'Who will be the Player of the Year?' 
                                                            : 'Most exciting sporting event of the year?'}
                                                    </h3>
                                                    <div className={styles.pollOptions}>
                                                        {index === 0 ? (
                                                            <>
                                                                <div className={styles.pollOption}>
                                                                    <div className={styles.pollOptionHeader}>
                                                                        <label className={styles.pollLabel}>
                                                                            <input type="radio" name={`poll-${item.id}`} />
                                                                            <span>Real Madrid</span>
                                                                        </label>
                                                                        <span className={styles.pollPercentage}>42%</span>
                                                                    </div>
                                                                    <div className={styles.pollProgressContainer}>
                                                                        <div className={styles.pollProgress} style={{ width: "42%" }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.pollOption}>
                                                                    <div className={styles.pollOptionHeader}>
                                                                        <label className={styles.pollLabel}>
                                                                            <input type="radio" name={`poll-${item.id}`} />
                                                                            <span>Manchester City</span>
                                                                        </label>
                                                                        <span className={styles.pollPercentage}>28%</span>
                                                                    </div>
                                                                    <div className={styles.pollProgressContainer}>
                                                                        <div className={styles.pollProgress} style={{ width: "28%" }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.pollOption}>
                                                                    <div className={styles.pollOptionHeader}>
                                                                        <label className={styles.pollLabel}>
                                                                            <input type="radio" name={`poll-${item.id}`} />
                                                                            <span>Bayern Munich</span>
                                                                        </label>
                                                                        <span className={styles.pollPercentage}>18%</span>
                                                                    </div>
                                                                    <div className={styles.pollProgressContainer}>
                                                                        <div className={styles.pollProgress} style={{ width: "18%" }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.pollOption}>
                                                                    <div className={styles.pollOptionHeader}>
                                                                        <label className={styles.pollLabel}>
                                                                            <input type="radio" name={`poll-${item.id}`} />
                                                                            <span>Liverpool</span>
                                                                        </label>
                                                                        <span className={styles.pollPercentage}>12%</span>
                                                                    </div>
                                                                    <div className={styles.pollProgressContainer}>
                                                                        <div className={styles.pollProgress} style={{ width: "12%" }}></div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className={styles.pollOption}>
                                                                    <div className={styles.pollOptionHeader}>
                                                                        <label className={styles.pollLabel}>
                                                                            <input type="radio" name={`poll-${item.id}`} />
                                                                            <span>Erling Haaland</span>
                                                                        </label>
                                                                        <span className={styles.pollPercentage}>37%</span>
                                                                    </div>
                                                                    <div className={styles.pollProgressContainer}>
                                                                        <div className={styles.pollProgress} style={{ width: "37%" }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.pollOption}>
                                                                    <div className={styles.pollOptionHeader}>
                                                                        <label className={styles.pollLabel}>
                                                                            <input type="radio" name={`poll-${item.id}`} />
                                                                            <span>Kylian Mbappé</span>
                                                                        </label>
                                                                        <span className={styles.pollPercentage}>31%</span>
                                                                    </div>
                                                                    <div className={styles.pollProgressContainer}>
                                                                        <div className={styles.pollProgress} style={{ width: "31%" }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.pollOption}>
                                                                    <div className={styles.pollOptionHeader}>
                                                                        <label className={styles.pollLabel}>
                                                                            <input type="radio" name={`poll-${item.id}`} />
                                                                            <span>Jude Bellingham</span>
                                                                        </label>
                                                                        <span className={styles.pollPercentage}>22%</span>
                                                                    </div>
                                                                    <div className={styles.pollProgressContainer}>
                                                                        <div className={styles.pollProgress} style={{ width: "22%" }}></div>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.pollOption}>
                                                                    <div className={styles.pollOptionHeader}>
                                                                        <label className={styles.pollLabel}>
                                                                            <input type="radio" name={`poll-${item.id}`} />
                                                                            <span>Vinicius Jr</span>
                                                                        </label>
                                                                        <span className={styles.pollPercentage}>10%</span>
                                                                    </div>
                                                                    <div className={styles.pollProgressContainer}>
                                                                        <div className={styles.pollProgress} style={{ width: "10%" }}></div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className={styles.pollFooter}>
                                                        <button className={styles.voteButton}>Vote</button>
                                                        <div className={styles.pollStats}>
                                                            {index === 0 ? '1,482' : '985'} votes • Ends in {index === 0 ? '2' : '5'} days
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {communityItems.length > visibleCommunityCount && (
                                    <button 
                                        className={styles.showMoreButton}
                                        onClick={toggleShowCommunityItems}
                                    >
                                        {showAllCommunityItems ? 'Show Less' : 'Show More'}
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                            className={showAllCommunityItems ? styles.rotateIcon : ''}
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </section>
                        
                        {/* Promotions & Bonuses Section */}
                        <section className={`${styles.promotionsSection} ${styles.welcomeSection}`}>
                            <header className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    Promotions & Bonuses
                                </h2>
                            </header>
                            
                            <div className={styles.promotionsContainer}>
                                {/* Featured Promotion with Animated Graphic */}
                                <div className={styles.featuredPromotion}>
                                    <div className={styles.promotionGraphic}>
                                        <div className={styles.spinWheel} id="spinWheel">
                                            <div className={styles.wheelCenter}></div>
                                            <div className={styles.wheelSegment} style={{ "--segment-color": "var(--accent-primary)", "--rotate": "0deg" }}></div>
                                            <div className={styles.wheelSegment} style={{ "--segment-color": "var(--accent-secondary)", "--rotate": "60deg" }}></div>
                                            <div className={styles.wheelSegment} style={{ "--segment-color": "var(--accent-tertiary)", "--rotate": "120deg" }}></div>
                                            <div className={styles.wheelSegment} style={{ "--segment-color": "var(--accent-primary)", "--rotate": "180deg" }}></div>
                                            <div className={styles.wheelSegment} style={{ "--segment-color": "var(--accent-secondary)", "--rotate": "240deg" }}></div>
                                            <div className={styles.wheelSegment} style={{ "--segment-color": "var(--accent-tertiary)", "--rotate": "300deg" }}></div>
                                            <div className={styles.wheelPointer}></div>
                                            <button className={styles.spinButton} onClick={spinTheWheel}>SPIN</button>
                                        </div>
                                    </div>
                                    <div className={styles.promotionContent}>
                                        <h3 className={styles.promotionTitle}>Daily Spin & Win</h3>
                                        <p className={styles.promotionDescription}>
                                            Spin the wheel once every 24 hours for a chance to win free bets, 
                                            bonus credit, odds boosts, and more!
                                        </p>
                                        <div className={styles.promotionMeta}>
                                            <div className={styles.promotionTimer}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                <span>Next spin available in {formatCountdown()}</span>
                                            </div>
                                            <button 
                                                className={`${styles.claimButton} ${!spinAvailable ? styles.buttonDisabled : ''}`} 
                                                onClick={handleClaimNow} 
                                                disabled={!spinAvailable}
                                            >
                                                {spinAvailable ? 'Claim Now' : 'Wait'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Promo Cards Row */}
                                <div className={styles.promotionCards}>
                                    {/* Weekly Reload Bonus */}
                                    <div className={styles.promoCard} style={{ "--delay": "0.1s" }}>
                                        <div className={styles.promoCardHeader}>
                                            <div className={styles.promoType}>WEEKLY BONUS</div>
                                            <div className={styles.promoExpiry}>5 days left</div>
                                        </div>
                                        <h3 className={styles.promoCardTitle}>
                                            <span className={styles.promoHighlight}>50%</span> Reload Bonus
                                        </h3>
                                        <p className={styles.promoCardDescription}>
                                            Get a 50% bonus on your deposit every Monday, up to 500 PDX.
                                        </p>
                                        <div className={styles.promoBenefits}>
                                            <div className={styles.promoBenefit}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                <span>Min deposit: 100 PDX</span>
                                            </div>
                                            <div className={styles.promoBenefit}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                <span>5x wagering requirement</span>
                                            </div>
                                        </div>
                                        <button className={styles.claimPromoButton}>
                                            Claim Bonus
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    {/* Risk Free Bet */}
                                    <div className={styles.promoCard} style={{ "--delay": "0.2s" }}>
                                        <div className={styles.promoCardHeader}>
                                            <div className={styles.promoType}>NEW USERS</div>
                                            <div className={styles.promoExpiry}>Ongoing</div>
                                        </div>
                                        <h3 className={styles.promoCardTitle}>
                                            <span className={styles.promoHighlight}>Risk-Free</span> First Bet
                                        </h3>
                                        <p className={styles.promoCardDescription}>
                                            Place your first bet with confidence! Get up to 200 PDX back if your first bet loses.
                                        </p>
                                        <div className={styles.promoBenefits}>
                                            <div className={styles.promoBenefit}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                <span>Must be your first bet</span>
                                            </div>
                                            <div className={styles.promoBenefit}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                <span>Minimum odds 1.5</span>
                                            </div>
                                        </div>
                                        <button className={styles.claimPromoButton}>
                                            Get Started
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    {/* Referral Bonus */}
                                    <div className={styles.promoCard} style={{ "--delay": "0.3s" }}>
                                        <div className={styles.promoCardHeader}>
                                            <div className={styles.promoType}>REFERRAL</div>
                                            <div className={styles.promoExpiry}>Permanent</div>
                                        </div>
                                        <h3 className={styles.promoCardTitle}>
                                            <span className={styles.promoHighlight}>100 PDX</span> Friend Bonus
                                        </h3>
                                        <p className={styles.promoCardDescription}>
                                            Invite your friends and both of you receive 100 PDX when they make their first deposit.
                                        </p>
                                        <div className={styles.promoBenefits}>
                                            <div className={styles.referralCode}>
                                                <input 
                                                    type="text" 
                                                    className={styles.referralInput} 
                                                    value="PREDIXOR-FRIEND" 
                                                    readOnly 
                                                />
                                                <button className={styles.copyButton}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <button className={styles.claimPromoButton}>
                                            Share Link
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                                <polyline points="16 6 12 2 8 6"></polyline>
                                                <line x1="12" y1="2" x2="12" y2="15"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Scratch Cards Section */}
                                <div className={styles.scratchCardSection}>
                                    <h3 className={styles.scratchCardTitle}>Scratch & Win Instant Prizes</h3>
                                    <p className={styles.scratchCardDescription}>
                                        {scratchCardsAvailable ? (
                                            <>Collect daily scratch cards and reveal instant rewards. 
                                            You have <span className={styles.scratchHighlight}>{scratchCardsCount} card{scratchCardsCount !== 1 ? 's' : ''}</span> waiting to be scratched!</>
                                        ) : (
                                            <>You've claimed all your scratch cards for now. New cards will be available in <span className={styles.scratchHighlight}>{formatScratchCountdown()}</span></>
                                        )}
                                    </p>
                                    
                                    <div className={styles.scratchCardContainer}>
                                        {scratchCardsAvailable && !claimedCards[1] && (
                                            <div className={styles.scratchCard} onClick={(e) => handleScratchReveal(e, 1)}>
                                                <div className={styles.scratchCardFront} ref={scratch1Ref}>
                                                    <div className={styles.scratchPattern}></div>
                                                    <div className={styles.scratchInstructions}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M14 4h6v6"></path>
                                                            <path d="M20 4L9 15"></path>
                                                            <path d="M4 20l7-7"></path>
                                                            <path d="M4 14h6v6"></path>
                                                        </svg>
                                                        Scratch to reveal
                                                    </div>
                                                </div>
                                                <div className={styles.scratchCardBack}>
                                                    <span className={styles.scratchPrize}>+50 PDX</span>
                                                    <p className={styles.scratchSubtext}>Bonus Credit!</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {scratchCardsAvailable && !claimedCards[2] && scratchCardsCount > 1 && (
                                            <div className={styles.scratchCard} onClick={(e) => handleScratchReveal(e, 2)}>
                                                <div className={styles.scratchCardFront} ref={scratch2Ref}>
                                                    <div className={styles.scratchPattern}></div>
                                                    <div className={styles.scratchInstructions}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M14 4h6v6"></path>
                                                            <path d="M20 4L9 15"></path>
                                                            <path d="M4 20l7-7"></path>
                                                            <path d="M4 14h6v6"></path>
                                                        </svg>
                                                        Scratch to reveal
                                                    </div>
                                                </div>
                                                <div className={styles.scratchCardBack}>
                                                    <span className={styles.scratchPrize}>Free Bet</span>
                                                    <p className={styles.scratchSubtext}>on any sport!</p>
                                                </div>
                                            </div>
                                        )}

                                        {!scratchCardsAvailable && (
                                            <div className={styles.scratchCardTimer}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                <span>Next cards available in {formatScratchCountdown()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Homepage;
