import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { FaUser, FaWallet, FaHistory, FaCog, FaTrophy, FaMoneyBillWave, FaEdit, FaLock } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useUser();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [bettingHistory, setBettingHistory] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          // Mock user data
          setUserData({
            id: userId || '1',
            username: user?.username || 'john_doe',
            email: user?.primaryEmailAddress?.emailAddress || 'john.doe@example.com',
            fullName: user?.fullName || 'John Doe',
            joinDate: '2023-01-15',
            verificationStatus: 'verified',
            accountBalance: 1250.75,
            totalBets: 47,
            winRate: 62,
            totalWon: 2450.50,
            totalLost: 1200.25,
            favoriteCategory: 'Sports'
          });

          // Mock betting history
          setBettingHistory([
            { 
              id: '1', 
              event: 'Lakers vs Warriors', 
              selection: 'Warriors', 
              amount: 100, 
              odds: 2.5,
              potentialWin: 250,
              result: 'win', 
              date: '2023-05-18T20:30:00',
              category: 'Basketball'
            },
            { 
              id: '2', 
              event: 'Chiefs vs Ravens', 
              selection: 'Chiefs', 
              amount: 50, 
              odds: 1.8,
              potentialWin: 90,
              result: 'loss', 
              date: '2023-05-19T18:15:00',
              category: 'Football'
            },
            { 
              id: '3', 
              event: 'Djokovic vs Nadal', 
              selection: 'Nadal', 
              amount: 75, 
              odds: 2.1,
              potentialWin: 157.5,
              result: 'win', 
              date: '2023-05-15T15:00:00',
              category: 'Tennis'
            },
            { 
              id: '4', 
              event: 'Bitcoin Price > $40k June 1', 
              selection: 'Yes', 
              amount: 200, 
              odds: 1.65,
              potentialWin: 330,
              result: 'pending', 
              date: '2023-05-20T10:45:00',
              category: 'Crypto'
            },
            { 
              id: '5', 
              event: 'Manchester United vs Liverpool', 
              selection: 'Liverpool', 
              amount: 150, 
              odds: 1.9,
              potentialWin: 285,
              result: 'win', 
              date: '2023-05-14T19:00:00',
              category: 'Soccer'
            }
          ]);

          // Mock transaction history
          setTransactionHistory([
            { id: '101', type: 'deposit', amount: 500, date: '2023-05-10T10:15:30', status: 'completed', method: 'Credit Card' },
            { id: '102', type: 'withdrawal', amount: 200, date: '2023-05-15T16:20:10', status: 'completed', method: 'Bank Transfer' },
            { id: '103', type: 'deposit', amount: 300, date: '2023-05-20T09:45:22', status: 'completed', method: 'PayPal' },
            { id: '104', type: 'withdrawal', amount: 150, date: '2023-05-25T14:30:45', status: 'pending', method: 'Bank Transfer' },
            { id: '105', type: 'deposit', amount: 250, date: '2023-05-28T11:20:15', status: 'completed', method: 'Credit Card' }
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, user]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Render bet result badge
  const renderBetResult = (result) => {
    switch (result) {
      case 'win':
        return <span className="bet-result win">Win</span>;
      case 'loss':
        return <span className="bet-result loss">Loss</span>;
      case 'pending':
        return <span className="bet-result pending">Pending</span>;
      default:
        return <span className="bet-result">{result}</span>;
    }
  };

  // Render transaction badge
  const renderTransactionType = (type) => {
    switch (type) {
      case 'deposit':
        return <span className="transaction-type deposit">Deposit</span>;
      case 'withdrawal':
        return <span className="transaction-type withdrawal">Withdrawal</span>;
      default:
        return <span className="transaction-type">{type}</span>;
    }
  };

  // Render transaction status
  const renderTransactionStatus = (status) => {
    switch (status) {
      case 'completed':
        return <span className="transaction-status completed">Completed</span>;
      case 'pending':
        return <span className="transaction-status pending">Pending</span>;
      case 'failed':
        return <span className="transaction-status failed">Failed</span>;
      default:
        return <span className="transaction-status">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="user-profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-sidebar">
        <div className="profile-user-info">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {userData?.fullName?.charAt(0) || 'U'}
            </div>
          )}
          <h2>{userData?.fullName}</h2>
          <p className="username">@{userData?.username}</p>
          <p className="join-date">Member since {formatDate(userData?.joinDate)}</p>
          <div className="account-balance">
            <span className="balance-label">Balance</span>
            <span className="balance-amount">{formatCurrency(userData?.accountBalance)}</span>
          </div>
        </div>

        <nav className="profile-nav">
          <button 
            className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className="nav-icon" />
            <span>Profile</span>
          </button>
          <button 
            className={`profile-nav-item ${activeTab === 'bets' ? 'active' : ''}`}
            onClick={() => setActiveTab('bets')}
          >
            <FaHistory className="nav-icon" />
            <span>Betting History</span>
          </button>
          <button 
            className={`profile-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <FaWallet className="nav-icon" />
            <span>Transactions</span>
          </button>
          <button 
            className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog className="nav-icon" />
            <span>Account Settings</span>
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h1>My Profile</h1>
            
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaHistory />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{userData?.totalBets}</span>
                  <span className="stat-label">Total Bets</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaTrophy />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{userData?.winRate}%</span>
                  <span className="stat-label">Win Rate</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <FaMoneyBillWave />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{formatCurrency(userData?.totalWon)}</span>
                  <span className="stat-label">Total Won</span>
                </div>
              </div>
            </div>
            
            <div className="profile-details-section">
              <h2>Personal Information</h2>
              <div className="profile-details-grid">
                <div className="profile-detail">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{userData?.fullName}</span>
                </div>
                <div className="profile-detail">
                  <span className="detail-label">Username</span>
                  <span className="detail-value">@{userData?.username}</span>
                </div>
                <div className="profile-detail">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{userData?.email}</span>
                </div>
                <div className="profile-detail">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">{formatDate(userData?.joinDate)}</span>
                </div>
                <div className="profile-detail">
                  <span className="detail-label">Verification Status</span>
                  <span className="detail-value verification-status">
                    {userData?.verificationStatus === 'verified' ? (
                      <span className="verified">Verified ✓</span>
                    ) : (
                      <span className="unverified">Unverified</span>
                    )}
                  </span>
                </div>
                <div className="profile-detail">
                  <span className="detail-label">Favorite Category</span>
                  <span className="detail-value">{userData?.favoriteCategory}</span>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="action-button edit-profile">
                  <FaEdit /> Edit Profile
                </button>
              </div>
            </div>
            
            <div className="recent-activity-section">
              <h2>Recent Activity</h2>
              <div className="recent-bets">
                <h3>Recent Bets</h3>
                {bettingHistory.slice(0, 3).map(bet => (
                  <div className="recent-bet-item" key={bet.id}>
                    <div className="bet-event">{bet.event}</div>
                    <div className="bet-details">
                      <span className="bet-selection">{bet.selection}</span>
                      <span className="bet-amount">{formatCurrency(bet.amount)}</span>
                      {renderBetResult(bet.result)}
                    </div>
                    <div className="bet-date">{formatDateTime(bet.date)}</div>
                  </div>
                ))}
                <button 
                  className="view-all-btn"
                  onClick={() => setActiveTab('bets')}
                >
                  View All Bets
                </button>
              </div>
              
              <div className="recent-transactions">
                <h3>Recent Transactions</h3>
                {transactionHistory.slice(0, 3).map(transaction => (
                  <div className="recent-transaction-item" key={transaction.id}>
                    <div className="transaction-info">
                      {renderTransactionType(transaction.type)}
                      <span className="transaction-method">{transaction.method}</span>
                    </div>
                    <span className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <div className="transaction-date">{formatDateTime(transaction.date)}</div>
                    {renderTransactionStatus(transaction.status)}
                  </div>
                ))}
                <button 
                  className="view-all-btn"
                  onClick={() => setActiveTab('transactions')}
                >
                  View All Transactions
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bets' && (
          <div className="bets-section">
            <h1>Betting History</h1>
            <div className="bets-filter">
              <div className="filter-group">
                <label>Filter by:</label>
                <select>
                  <option value="all">All Bets</option>
                  <option value="win">Wins</option>
                  <option value="loss">Losses</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Category:</label>
                <select>
                  <option value="all">All Categories</option>
                  <option value="Sports">Sports</option>
                  <option value="Politics">Politics</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Crypto">Crypto</option>
                </select>
              </div>
            </div>
            
            <div className="bets-list">
              <table className="bets-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Selection</th>
                    <th>Amount</th>
                    <th>Odds</th>
                    <th>Potential Win</th>
                    <th>Result</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bettingHistory.map(bet => (
                    <tr key={bet.id}>
                      <td className="event-cell">
                        <div className="event-name">{bet.event}</div>
                        <div className="event-category">{bet.category}</div>
                      </td>
                      <td>{bet.selection}</td>
                      <td>{formatCurrency(bet.amount)}</td>
                      <td>{bet.odds.toFixed(2)}</td>
                      <td>{formatCurrency(bet.potentialWin)}</td>
                      <td>{renderBetResult(bet.result)}</td>
                      <td>{formatDateTime(bet.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-section">
            <h1>Transaction History</h1>
            
            <div className="wallet-summary">
              <div className="wallet-balance">
                <h3>Current Balance</h3>
                <div className="balance-amount">{formatCurrency(userData?.accountBalance)}</div>
                <div className="wallet-actions">
                  <button className="deposit-btn">Deposit Funds</button>
                  <button className="withdraw-btn">Withdraw Funds</button>
                </div>
              </div>
            </div>
            
            <div className="transactions-filter">
              <div className="filter-group">
                <label>Filter by:</label>
                <select>
                  <option value="all">All Transactions</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Status:</label>
                <select>
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            
            <div className="transactions-list">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{renderTransactionType(transaction.type)}</td>
                      <td className={`amount-cell ${transaction.type}`}>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>{transaction.method}</td>
                      <td>{formatDateTime(transaction.date)}</td>
                      <td>{renderTransactionStatus(transaction.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h1>Account Settings</h1>
            
            <div className="settings-card">
              <h2>Personal Information</h2>
              <form className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" defaultValue={userData?.fullName} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" defaultValue={userData?.username} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" defaultValue={userData?.email} />
                  </div>
                </div>
                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </div>
            
            <div className="settings-card">
              <h2>Security</h2>
              <form className="settings-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input type="password" id="currentPassword" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" id="newPassword" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" />
                  </div>
                </div>
                <button type="submit" className="save-btn">
                  <FaLock /> Update Password
                </button>
              </form>
            </div>
            
            <div className="settings-card">
              <h2>Notifications</h2>
              <form className="settings-form">
                <div className="form-group toggle">
                  <div className="toggle-label">
                    <label htmlFor="emailNotifications">Email Notifications</label>
                    <p className="toggle-description">Receive updates about your account, bets and promotions</p>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" id="emailNotifications" defaultChecked={true} />
                    <label htmlFor="emailNotifications"></label>
                  </div>
                </div>
                
                <div className="form-group toggle">
                  <div className="toggle-label">
                    <label htmlFor="betNotifications">Bet Results</label>
                    <p className="toggle-description">Get notified when your bets are settled</p>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" id="betNotifications" defaultChecked={true} />
                    <label htmlFor="betNotifications"></label>
                  </div>
                </div>
                
                <div className="form-group toggle">
                  <div className="toggle-label">
                    <label htmlFor="marketingNotifications">Marketing Communications</label>
                    <p className="toggle-description">Receive special offers and promotions</p>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" id="marketingNotifications" defaultChecked={false} />
                    <label htmlFor="marketingNotifications"></label>
                  </div>
                </div>
                
                <button type="submit" className="save-btn">Save Preferences</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 