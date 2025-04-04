import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import './admindashboard.css';
import { 
  FaChartLine,
  FaUsers, 
  FaCalendarAlt, 
  FaMoneyBillWave,
  FaCog,
  FaCheckCircle,
  FaEye,
  FaTrophy,
  FaFootballBall,
  FaBasketballBall,
  FaHockeyPuck,
  FaBaseballBall,
  FaBolt,
  FaArrowRight,
  FaArrowDown,
  FaArrowUp,
  FaEdit,
  FaTrash,
  FaFlag,
  FaTimes
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  console.log("Rendering AdminDashboard component");
  
  // State management
  const [loading, setLoading] = useState(true);
  const [matchesExpanded, setMatchesExpanded] = useState(false);
  const [betsExpanded, setBetsExpanded] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [resultData, setResultData] = useState({
    teamAScore: '',
    teamBScore: '',
    winningOption: '',
    status: 'completed'
  });

  // Visibility limits
  const collapsedMatchLimit = 1;
  const collapsedBetsLimit = 2;

  // Mock data for dashboard
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    completedEvents: 0,
    totalTransactions: 0,
    totalRevenue: 0
  });

  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentBets, setRecentBets] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Toggle visibility of matches
  const toggleMatchesView = () => {
    setMatchesExpanded(!matchesExpanded);
  };

  // Toggle visibility of bets
  const toggleBetsView = () => {
    setBetsExpanded(!betsExpanded);
  };

  // Helper function to navigate to sections
  const navigateToSection = (section) => {
    navigate(`/admin/${section}`);
  };

  // Open result declaration modal
  const openResultModal = (match) => {
    setSelectedMatch(match);
    setResultData({
      teamAScore: match.scoreA || '',
      teamBScore: match.scoreB || '',
      winningOption: '',
      status: 'completed'
    });
    setShowResultModal(true);
  };

  // Close result declaration modal
  const closeResultModal = () => {
    setShowResultModal(false);
    setSelectedMatch(null);
  };

  // Handle result form input changes
  const handleResultChange = (e) => {
    const { name, value } = e.target;
    setResultData({
      ...resultData,
      [name]: value
    });
  };

  // Submit result and mark event as completed
  const submitResult = () => {
    // In a real app, you would make an API call here
    // For this mock, we'll update the state
    
    // Update the match with the result
    const updatedLiveMatches = liveMatches.map(match => {
      if (match.id === selectedMatch.id) {
        return {
          ...match,
          scoreA: parseInt(resultData.teamAScore),
          scoreB: parseInt(resultData.teamBScore),
          status: 'completed',
          winningOption: resultData.winningOption
        };
      }
      return match;
    });
    
    // Move the match from live to completed
    const completedMatch = updatedLiveMatches.find(match => match.id === selectedMatch.id);
    const remainingLiveMatches = updatedLiveMatches.filter(match => match.id !== selectedMatch.id);
    
    setLiveMatches(remainingLiveMatches);
    
    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      activeEvents: prevStats.activeEvents - 1,
      completedEvents: prevStats.completedEvents + 1
    }));
    
    // Close the modal
    closeResultModal();
    
    // Show confirmation message (in a real app, you would use a toast or notification)
    alert(`Result for ${selectedMatch.teamA} vs ${selectedMatch.teamB} has been recorded.`);
  };

  // Initialize and load mock data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      setStats({
        totalUsers: 2458,
        activeEvents: 38,
        completedEvents: 145,
        totalTransactions: 18432,
        totalRevenue: 243850
      });
      
      setRecentActivity([
        { id: 1, type: 'bet', user: 'john_doe', action: 'Placed a bet on "Lakers vs Warriors"', amount: 50, time: '10 minutes ago' },
        { id: 2, type: 'deposit', user: 'alice_smith', action: 'Made a deposit to wallet', amount: 200, time: '25 minutes ago' },
        { id: 3, type: 'signup', user: 'new_player21', action: 'Created a new account', amount: null, time: '1 hour ago' },
        { id: 4, type: 'bet', user: 'crypto_king', action: 'Placed a bet on "Bitcoin Price Above $60K"', amount: 100, time: '2 hours ago' },
        { id: 5, type: 'withdrawal', user: 'big_winner', action: 'Withdrew funds from wallet', amount: 500, time: '3 hours ago' },
        { id: 6, type: 'bet', user: 'sports_fan', action: 'Won bet on "UFC Championship Match"', amount: 250, time: '5 hours ago' }
      ]);

      // Set mock live matches
      setLiveMatches([
        {
          id: 1,
          type: 'basketball',
          league: 'NBA',
          teamA: 'Lakers',
          teamB: 'Warriors',
          scoreA: 87,
          scoreB: 92,
          timeRemaining: '3rd Quarter - 4:53',
          odds: { teamA: 2.1, teamB: 1.8, draw: null },
          totalBets: 237,
          totalAmount: 8240,
          status: 'live'
        },
        {
          id: 2,
          type: 'football',
          league: 'NFL',
          teamA: 'Chiefs',
          teamB: 'Ravens',
          scoreA: 24,
          scoreB: 21,
          timeRemaining: '3rd Quarter - 8:12',
          odds: { teamA: 1.9, teamB: 2.0, draw: null },
          totalBets: 312,
          totalAmount: 11250,
          status: 'live'
        },
        {
          id: 3,
          type: 'hockey',
          league: 'NHL',
          teamA: 'Maple Leafs',
          teamB: 'Bruins',
          scoreA: 2,
          scoreB: 2,
          timeRemaining: '2nd Period - 7:20',
          odds: { teamA: 2.3, teamB: 1.7, draw: 3.5 },
          totalBets: 187,
          totalAmount: 5840,
          status: 'live'
        }
      ]);

      // Set mock upcoming matches
      setUpcomingMatches([
        {
          id: 4,
          type: 'basketball',
          league: 'NBA',
          teamA: 'Celtics',
          teamB: 'Nets',
          startTime: 'Today, 7:30 PM',
          odds: { teamA: 1.6, teamB: 2.4, draw: null },
          totalBets: 145,
          status: 'upcoming'
        },
        {
          id: 5,
          type: 'football',
          league: 'NFL',
          teamA: 'Eagles',
          teamB: 'Cowboys',
          startTime: 'Tomorrow, 1:00 PM',
          odds: { teamA: 2.1, teamB: 1.9, draw: null },
          totalBets: 203,
          status: 'upcoming'
        },
        {
          id: 6,
          type: 'baseball',
          league: 'MLB',
          teamA: 'Yankees',
          teamB: 'Red Sox',
          startTime: 'Tomorrow, 6:05 PM',
          odds: { teamA: 1.75, teamB: 2.2, draw: null },
          totalBets: 98,
          status: 'upcoming'
        }
      ]);

      // Set mock recent bets
      setRecentBets([
        {
          id: 101,
          user: 'john_doe',
          match: 'Lakers vs Warriors',
          selection: 'Warriors',
          amount: 100,
          potentialWin: 180,
          time: '15 minutes ago',
          status: 'active'
        },
        {
          id: 102,
          user: 'sports_fan42',
          match: 'Chiefs vs Ravens',
          selection: 'Chiefs',
          amount: 50,
          potentialWin: 95,
          time: '32 minutes ago',
          status: 'active'
        },
        {
          id: 103,
          user: 'betmaster',
          match: 'Maple Leafs vs Bruins',
          selection: 'Draw',
          amount: 75,
          potentialWin: 262.5,
          time: '1 hour ago',
          status: 'active'
        },
        {
          id: 104,
          user: 'lucky_gambler',
          match: 'Eagles vs Cowboys',
          selection: 'Eagles',
          amount: 200,
          potentialWin: 420,
          time: '2 hours ago',
          status: 'active'
        }
      ]);
    }, 1000);
  }, []);

  // Helper function to render sport icon
  const getSportIcon = (type) => {
    switch (type) {
      case 'basketball':
        return <FaBasketballBall />;
      case 'football':
        return <FaFootballBall />;
      case 'hockey':
        return <FaHockeyPuck />;
      case 'baseball':
        return <FaBaseballBall />;
      default:
        return <FaCalendarAlt />;
    }
  };

  // Loading state
  if (loading) {
    console.log("AdminDashboard is in loading state");
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  console.log("AdminDashboard is rendering main content");
  return (
    <div className="admin-dashboard-page" data-theme={localStorage.getItem('theme') || 'dark'} style={{backgroundColor: 'var(--background-secondary)', position: 'relative', zIndex: 10}}>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Predixor betting platform management</p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-stats-container">
        <h2 className="section-title">Overview</h2>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon users">
              <FaUsers />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalUsers.toLocaleString()}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon events">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.activeEvents.toLocaleString()}</span>
              <span className="stat-label">Active Events</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon completed">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.completedEvents.toLocaleString()}</span>
              <span className="stat-label">Completed Events</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon transactions">
              <FaMoneyBillWave />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalTransactions.toLocaleString()}</span>
              <span className="stat-label">Transactions</span>
            </div>
          </div>
          
            
          
        </div>
      </div>

      {/* Live Matches & Betting Activity */}
      <div className="dashboard-sections-container">
        <div className="dashboard-grid">
          <section className="dashboard-section live-matches-section">
            <div className="section-header">
              <h2 className="section-title">Live Matches</h2>
              <button 
                className={`view-all-btn ${matchesExpanded ? 'active' : ''}`} 
                onClick={toggleMatchesView}
              >
                {matchesExpanded ? 'View Less ' : 'View All '}
                {matchesExpanded ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
              </button>
            </div>
            <div className="live-matches">
              {/* Always show the first match */}
              {liveMatches.slice(0, collapsedMatchLimit).map(match => (
                <div className="match-card" key={match.id}>
                  <div className="match-header">
                    <div className="match-header-left">
                      <div className="sport-icon">{getSportIcon(match.type)}</div>
                      <div className="league-name">{match.league}</div>
                    </div>
                    <div className="match-status live"><FaBolt /> LIVE</div>
                  </div>
                  
                  <div className="match-content">
                    <div className="teams">
                      <div className="team">
                        <span className="team-name">{match.teamA}</span>
                        <span className="team-score">{match.scoreA}</span>
                      </div>
                      <div className="vs">VS</div>
                      <div className="team">
                        <span className="team-name">{match.teamB}</span>
                        <span className="team-score">{match.scoreB}</span>
                      </div>
                    </div>
                    
                    <div className="match-time">{match.timeRemaining}</div>
                    
                    <div className="match-odds">
                      <div className="odds-item">
                        <span className="odds-label">{match.teamA}</span>
                        <span className="odds-value">{match.odds.teamA}</span>
                      </div>
                      
                      {match.odds.draw && (
                        <div className="odds-item">
                          <span className="odds-label">Draw</span>
                          <span className="odds-value">{match.odds.draw}</span>
                        </div>
                      )}
                      
                      <div className="odds-item">
                        <span className="odds-label">{match.teamB}</span>
                        <span className="odds-value">{match.odds.teamB}</span>
                      </div>
                    </div>
                    
                    <div className="match-stats">
                      <div className="stat">
                        <span className="stat-label">Total Bets:</span>
                        <span className="stat-value">{match.totalBets}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total Amount:</span>
                        <span className="stat-value">${match.totalAmount}</span>
                      </div>
                    </div>

                    {/* Match actions */}
                    <div className="match-actions">
                      <button 
                        className="action-btn declare-result"
                        onClick={() => openResultModal(match)}
                        title="Declare result"
                      >
                        <FaFlag /> Declare Result
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Conditionally show remaining matches based on expanded state */}
              <div className={matchesExpanded ? 'expanded-content' : 'collapsed-content'}>
                {liveMatches.slice(collapsedMatchLimit).map(match => (
                  <div className="match-card" key={match.id}>
                    <div className="match-header">
                      <div className="match-header-left">
                        <div className="sport-icon">{getSportIcon(match.type)}</div>
                        <div className="league-name">{match.league}</div>
                      </div>
                      <div className="match-status live"><FaBolt /> LIVE</div>
                    </div>
                    
                    <div className="match-content">
                      <div className="teams">
                        <div className="team">
                          <span className="team-name">{match.teamA}</span>
                          <span className="team-score">{match.scoreA}</span>
                        </div>
                        <div className="vs">VS</div>
                        <div className="team">
                          <span className="team-name">{match.teamB}</span>
                          <span className="team-score">{match.scoreB}</span>
                        </div>
                      </div>
                      
                      <div className="match-time">{match.timeRemaining}</div>
                      
                      <div className="match-odds">
                        <div className="odds-item">
                          <span className="odds-label">{match.teamA}</span>
                          <span className="odds-value">{match.odds.teamA}</span>
                        </div>
                        
                        {match.odds.draw && (
                          <div className="odds-item">
                            <span className="odds-label">Draw</span>
                            <span className="odds-value">{match.odds.draw}</span>
                          </div>
                        )}
                        
                        <div className="odds-item">
                          <span className="odds-label">{match.teamB}</span>
                          <span className="odds-value">{match.odds.teamB}</span>
                        </div>
                      </div>
                      
                      <div className="match-stats">
                        <div className="stat">
                          <span className="stat-label">Total Bets:</span>
                          <span className="stat-value">{match.totalBets}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Total Amount:</span>
                          <span className="stat-value">${match.totalAmount}</span>
                        </div>
                      </div>

                      {/* Match actions */}
                      <div className="match-actions">
                        <button 
                          className="action-btn declare-result"
                          onClick={() => openResultModal(match)}
                          title="Declare result"
                        >
                          <FaFlag /> Declare Result
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          <section className="dashboard-section recent-bets-section">
            <div className="section-header">
              <h2 className="section-title">Recent Bets</h2>
              <button 
                className={`view-all-btn ${betsExpanded ? 'active' : ''}`} 
                onClick={toggleBetsView}
              >
                {betsExpanded ? 'View Less ' : 'View All '}
                {betsExpanded ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
              </button>
            </div>
            <div className="recent-bets">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Match</th>
                    <th>Selection</th>
                    <th>Amount</th>
                    <th>Potential Win</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Always show the first two rows */}
                  {recentBets.slice(0, collapsedBetsLimit).map(bet => (
                    <tr key={bet.id}>
                      <td>{bet.user}</td>
                      <td>{bet.match}</td>
                      <td>{bet.selection}</td>
                      <td>${bet.amount}</td>
                      <td>${bet.potentialWin}</td>
                      <td>{bet.time}</td>
                    </tr>
                  ))}

                  {/* Conditionally show remaining rows based on expanded state */}
                  {betsExpanded && recentBets.slice(collapsedBetsLimit).map(bet => (
                    <tr key={bet.id}>
                      <td>{bet.user}</td>
                      <td>{bet.match}</td>
                      <td>{bet.selection}</td>
                      <td>${bet.amount}</td>
                      <td>${bet.potentialWin}</td>
                      <td>{bet.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Event Results Declaration Section */}
      <div className="dashboard-section event-results-section">
        <div className="section-header">
          <h2 className="section-title">Declare Event Results</h2>
        </div>
        <div className="events-declaration-container">
          <p className="section-description">Select from the list of active events to declare final results and settle bets.</p>
          <div className="events-for-results">
            {liveMatches.slice(0, 2).map(match => (
              <div className="match-declaration-card" key={match.id}>
                <div className="match-header">
                  <div className="match-header-left">
                    <div className="sport-icon">{getSportIcon(match.type)}</div>
                    <div className="league-name">{match.league}</div>
                  </div>
                  <div className="match-status live"><FaBolt /> LIVE</div>
                </div>
                <div className="match-content">
                  <div className="teams">
                    <div className="team">
                      <span className="team-name">{match.teamA}</span>
                      <span className="team-score">{match.scoreA}</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                      <span className="team-name">{match.teamB}</span>
                      <span className="team-score">{match.scoreB}</span>
                    </div>
                  </div>
                  <button 
                    className="action-btn declare-result"
                    onClick={() => openResultModal(match)}
                  >
                    <FaFlag /> Declare Final Result
                  </button>
                </div>
              </div>
            ))}
            {liveMatches.length > 2 && (
              <button className="view-more-results-btn" onClick={() => navigateToSection('events')}>
                View all {liveMatches.length} active events
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="quick-access-container">
        <div className="section-header">
          <h2 className="section-title">Quick Access</h2>
        </div>
        <div className="admin-dashboard-grid">
          <div 
            className="dashboard-card" 
            onClick={() => navigateToSection('users')}
          >
            <div className="dashboard-card-icon">
              <FaUsers />
            </div>
            <div className="dashboard-card-content">
              <h3>User Management</h3>
              <p>Manage user accounts and permissions</p>
            </div>
          </div>
          
          <div 
            className="dashboard-card" 
            onClick={() => navigateToSection('events')}
          >
            <div className="dashboard-card-icon">
              <FaCalendarAlt />
            </div>
            <div className="dashboard-card-content">
              <h3>Event Management</h3>
              <p>Create, manage and declare results for betting events</p>
            </div>
          </div>
          
          <div 
            className="dashboard-card" 
            onClick={() => navigateToSection('transactions')}
          >
            <div className="dashboard-card-icon">
              <FaMoneyBillWave />
            </div>
            <div className="dashboard-card-content">
              <h3>Transactions</h3>
              <p>Review and manage financial transactions</p>
            </div>
          </div>
          
          <div 
            className="dashboard-card" 
            onClick={() => navigateToSection('settings')}
          >
            <div className="dashboard-card-icon">
              <FaCog />
            </div>
            <div className="dashboard-card-content">
              <h3>Platform Settings</h3>
              <p>Configure platform settings and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Result Declaration Modal */}
      {showResultModal && selectedMatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Declare Result: {selectedMatch.teamA} vs {selectedMatch.teamB}</h2>
              <button className="close-modal-btn" onClick={closeResultModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="event-form">
                <div className="form-section">
                  <h3>Match Result</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="teamAScore">{selectedMatch.teamA} Score</label>
                      <input
                        type="number"
                        id="teamAScore"
                        name="teamAScore"
                        value={resultData.teamAScore}
                        onChange={handleResultChange}
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="teamBScore">{selectedMatch.teamB} Score</label>
                      <input
                        type="number"
                        id="teamBScore"
                        name="teamBScore"
                        value={resultData.teamBScore}
                        onChange={handleResultChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="winningOption">Winning Option</label>
                    <select
                      id="winningOption"
                      name="winningOption"
                      value={resultData.winningOption}
                      onChange={handleResultChange}
                      required
                    >
                      <option value="">-- Select Winner --</option>
                      <option value={selectedMatch.teamA}>{selectedMatch.teamA}</option>
                      {selectedMatch.odds.draw && <option value="Draw">Draw</option>}
                      <option value={selectedMatch.teamB}>{selectedMatch.teamB}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={resultData.status}
                      onChange={handleResultChange}
                    >
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="cancel-btn" onClick={closeResultModal}>
                    Cancel
                  </button>
                  <button 
                    className="submit-btn"
                    onClick={submitResult}
                    disabled={!resultData.winningOption}
                  >
                    <FaCheckCircle /> Confirm Result
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 