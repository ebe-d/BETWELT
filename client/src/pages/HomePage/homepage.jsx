import { useUser } from "@clerk/clerk-react"; 
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
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
    const [walletBalance, setWalletBalance] = useState(1250.75);
    // User predictions state
    const [userPredictions, setUserPredictions] = useState([]);
    
    const [showAllBettingHistory, setShowAllBettingHistory] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [userBets, setUserBets] = useState([]);
    
    // User prediction history data - will be populated from API
    const [predictionHistory, setPredictionHistory] = useState([]);
    
    // Performance metrics - will be populated from API
    const [perfMetrics, setPerfMetrics] = useState({
        totalBets: 0,
        winRate: 0,
        avgOdds: 0,
        bestCategory: null,
        bestCategoryWinRate: 0,
        profitLossRatio: 0,
        netProfit: 0,
        monthlySummary: [],
        categorySummary: []
    });
    
    // Generate SVG path for the monthly performance graph
    const generateSvgPath = useCallback(() => {
        if (!perfMetrics.monthlySummary || perfMetrics.monthlySummary.length === 0) {
            return {
                linePath: '',
                areaPath: ''
            };
        }
        
        // Find max profit for scaling
        const maxProfit = Math.max(
            ...perfMetrics.monthlySummary.map(month => Math.abs(month.profit)),
            100 // Minimum scale value to avoid empty graph
        );
        
        // Calculate points for each month
        const points = perfMetrics.monthlySummary.map((month, index) => {
            const x = (500 / (perfMetrics.monthlySummary.length - 1 || 1)) * index;
            // Invert Y coordinate (SVG 0,0 is top-left)
            // Scale to fit within 200px height (leaving 20px margin at top and bottom)
            const y = 160 - ((month.profit / maxProfit) * 140);
            return { x, y };
        });
        
        // Generate polyline points string for line graph
        const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
        
        // Generate path for area under the line
        let areaPath = `M${points[0].x},${points[0].y} `;
        points.forEach(p => {
            areaPath += `L${p.x},${p.y} `;
        });
        // Complete the area path by drawing to the bottom right and then bottom left
        areaPath += `L${points[points.length - 1].x},200 L${points[0].x},200 Z`;
        
        return {
            linePath: linePoints,
            areaPath: areaPath
        };
    }, [perfMetrics.monthlySummary]);

    // Number of items to show initially
    const visibleHistoryCount = 3;
    const visibleCategoryCount = 3;
        
    // Filter prediction history based on showAllBettingHistory state
    const displayedPredictionHistory = showAllBettingHistory
        ? predictionHistory
        : predictionHistory.slice(0, visibleHistoryCount);
        
    // Filter categories based on showAllCategories state
    const displayedCategories = showAllCategories
        ? perfMetrics.categorySummary
        : perfMetrics.categorySummary.slice(0, visibleCategoryCount);

    // Toggle functions for show more/less
    
    // Toggle function for betting history
    const toggleShowBettingHistory = () => {
        setShowAllBettingHistory(!showAllBettingHistory);
    };
    
    // Toggle function for categories
    const toggleShowCategories = () => {
        setShowAllCategories(!showAllCategories);
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
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: user.id
                        }),
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

    // Fetch user predictions, performance analytics, and wallet balance
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            
            try {
                // Fetch user predictions
                const predictionsResponse = await axios.get(`/api/predictions/user/${user.id}`);
                const predictions = predictionsResponse.data;
                
                // Process predictions to include event details
                const processedPredictions = [];
                
                for (const prediction of predictions) {
                    try {
                        // Fetch event details for each prediction
                        const eventResponse = await axios.get(`/api/events/${prediction.eventId}`);
                        const event = eventResponse.data;
                        
                        processedPredictions.push({
                            id: prediction._id,
                            event: event.title,
                            match: event.match,
                            date: new Date(prediction.createdAt).toLocaleDateString(),
                            betAmount: prediction.amount,
                            odds: prediction.odds,
                            result: prediction.status === 'won' ? 'win' : prediction.status === 'lost' ? 'loss' : 'pending',
                            payout: prediction.status === 'won' ? prediction.potentialWinnings : 0,
                            profit: prediction.status === 'won' ? prediction.potentialWinnings - prediction.amount : -prediction.amount,
                            category: event.category,
                            status: prediction.status === 'pending' ? 'Ongoing' : 'Finished',
                            eventId: event._id
                        });
                    } catch (err) {
                        console.error('Error fetching event details:', err);
                    }
                }
                
                setPredictionHistory(processedPredictions);
                setUserBets(processedPredictions.slice(0, 3)); // Set the first 3 for userBets display
                
                // Fetch performance analytics
                const analyticsResponse = await axios.get(`/api/predictions/analytics/${user.id}`);
                setPerfMetrics(analyticsResponse.data);
                
                // Fetch wallet balance
                try {
                    const walletResponse = await axios.get(`/api/users/${user.id}/wallet`);
                    if (walletResponse.data && walletResponse.data.balance) {
                        setWalletBalance(walletResponse.data.balance);
                    }
                } catch (err) {
                    console.error('Error fetching wallet balance:', err);
                }
                
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to load your prediction data');
            }
        };

        if (isSignedIn && user) {
            fetchUserData();
        }
    }, [isSignedIn, user]);

    if (!isLoaded) {
        return <Loading />;
    }

    return (
        <>
            <Navbar imglink={user?.imageUrl || ''} walletBalance={walletBalance} />
            <main className={styles.container}>
                <div className={styles.auroraWrapper}>
                    <Aurora 
                        colorStops={theme === 'dark' ? ["#1a1a1a", "#0d0d0d", "#000000"] :['white']} 
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
                        {/* Recent Betting Activity Section */}
                        <section className={`${styles.bettingHistorySection} ${styles.welcomeSection}`}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20V10"></path>
                                        <path d="M18 20V4"></path>
                                        <path d="M6 20v-6"></path>
                                    </svg>
                                    Recent Prediction Activity
                                </h2>
                                <div className={styles.headerActions}>
                                    <button className={styles.viewAllButton} onClick={() => navigate('/home/events')}>
                                        View All Events
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {displayedPredictionHistory.length > 0 ? (
                                <div className={styles.bettingHistoryList}>
                                    {displayedPredictionHistory.map((bet, index) => (
                                        <div className={`${styles.historyRow} ${bet.result === 'win' ? styles.winRow : bet.result === 'loss' ? styles.lossRow : styles.pendingRow}`} key={bet.id} style={{ "--delay": `${0.1 + index * 0.1}s` }}>
                                            <div className={styles.historyIndicator}></div>
                                            <div className={styles.historyContent}>
                                                <div className={styles.historyMain}>
                                                    <div className={styles.historyInfo}>
                                                        <h4 className={styles.historyTitle}>{bet.match}</h4>
                                                        <div className={styles.historyMeta}>
                                                            <span className={styles.historyEvent}>{bet.event}</span>
                                                            <span className={styles.historyCategory}>{bet.category}</span>
                                                            <span className={styles.historyDate}>{bet.date}</span>
                                                            <span className={`${styles.historyStatus} ${bet.result === 'win' || bet.result === 'loss' ? styles.statusFinished : styles.statusPending}`}>
                                                                {bet.result === 'win' || bet.result === 'loss' ? 'Finished' : 'Pending'}
                                                            </span>
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
                                                        <div className={`${styles.historyStat} ${bet.result === 'pending' ? styles.pendingStat : bet.profit >= 0 ? styles.profitStat : styles.lossStat}`}>
                                                            <span className={styles.historyStatValue}>
                                                                {bet.result === 'pending' ? 'Pending' : `${bet.profit > 0 ? '+' : ''}${bet.profit} PDX`}
                                                            </span>
                                                            <span className={styles.historyStatLabel}>Profit/Loss</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.historyResult}>
                                                    <span className={`${styles.resultBadge} ${bet.result === 'win' ? styles.winBadge : bet.result === 'loss' ? styles.lossBadge : styles.pendingBadge}`}>
                                                        {bet.result === 'win' ? 'WIN' : bet.result === 'loss' ? 'LOSS' : 'PENDING'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {predictionHistory.length > visibleHistoryCount && (
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
                                    )}
                                </div>
                            ) : (
                                <div className={styles.noBettingHistory}>
                                    <p>You haven't made any predictions yet.</p>
                                    <button 
                                        className={styles.placeBetButton}
                                        onClick={() => navigate('/home/events')}
                                    >
                                        Make Your First Prediction
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Performance Analytics Section */}
                        <section className={`${styles.performanceSection} ${styles.welcomeSection}`}>
                            <header className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20V10"></path>
                                        <path d="M18 20V4"></path>
                                        <path d="M6 20v-6"></path>
                                    </svg>
                                    Performance Analytics
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
                                            {perfMetrics.monthlySummary.length > 0 ? (
                                                <>
                                                    <div className={styles.yAxisLabel}>
                                                        {Math.max(
                                                            ...perfMetrics.monthlySummary.map(month => Math.abs(month.profit)),
                                                            100
                                                        )}
                                                    </div>
                                                    <div className={styles.yAxisLabel}>
                                                        {Math.round(Math.max(
                                                            ...perfMetrics.monthlySummary.map(month => Math.abs(month.profit)),
                                                            100
                                                        ) * 0.66)}
                                                    </div>
                                                    <div className={styles.yAxisLabel}>
                                                        {Math.round(Math.max(
                                                            ...perfMetrics.monthlySummary.map(month => Math.abs(month.profit)),
                                                            100
                                                        ) * 0.33)}
                                                    </div>
                                                    <div className={styles.yAxisLabel}>0</div>
                                                </>
                                            ) : (
                                                <>
                                                   
                                                </>
                                            )}
                                        </div>
                                        <div className={styles.chartContent}>
                                            <svg 
                                                className={styles.lineGraph} 
                                                viewBox="0 0 500 200" 
                                                preserveAspectRatio="none"
                                            >
                                                {perfMetrics.monthlySummary.length > 0 ? (
                                                    <>
                                                        <polyline 
                                                            className={styles.profitLine}
                                                            points={generateSvgPath().linePath}
                                                            stroke="var(--accent-primary)" 
                                                            fill="none" 
                                                        />
                                                        <path 
                                                            className={styles.profitArea}
                                                            d={generateSvgPath().areaPath}
                                                            fill="url(#profitGradient)"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <rect x="50" y="60" width="400" height="80" rx="10" fill="rgba(var(--accent-primary-rgb), 0.1)" stroke="rgba(var(--accent-primary-rgb), 0.3)" strokeWidth="1" />
                                                        <text x="250" y="95" textAnchor="middle" fill="var(--text-primary)" fontWeight="700" fontSize="12">
                                                            No Performance Data Available
                                                        </text>
                                                        <text x="250" y="125" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">
                                                            Place predictions to track your performance
                                                        </text>
                                                    </>
                                                )}
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
                                    {displayedCategories.length > 0 ? (
                                        displayedCategories.map((category, index) => (
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
                                        ))
                                    ) : (
                                        <div className={styles.noCategoryData}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                                <path d="M3 5c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                                                <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                                            </svg>
                                            <h4>No Category Data Available</h4>
                                            <p>Make predictions across different categories to see your performance breakdown</p>
                                        </div>
                                    )}
                                    
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


                        </section>
                        
                        {/* Promotions & Bonuses Section - Removed, now in the Rewards page */}
                        
                    </div>
                </div>
            </main>
        </>
    );
}

export default Homepage;
