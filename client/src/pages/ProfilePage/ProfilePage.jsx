import React, { useState, useEffect } from 'react';
import './profilepage.css';
import { useUser } from '../../context/UserContext';
import { useUser as useClerkUser } from '@clerk/clerk-react';
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaCamera, 
  FaShieldAlt, 
  FaClock, 
  FaMobile, 
  FaLaptop,
  FaHistory,
  FaWallet,
  FaTrophy,
  FaChevronLeft,
  FaGlobe,
  FaMapMarkerAlt,
  FaLink,
  FaBriefcase,
  FaUserTag,
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { userData } = useUser();
  const { user, isLoaded } = useClerkUser();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    location: '',
    website: '',
    occupation: '',
    favoriteCategories: []
  });
  
  // Placeholder data for security and activity
  const securityData = {
    lastPasswordChange: '2 months ago',
    twoFactorEnabled: false,
    activeSessions: [
      { device: 'iPhone 13', location: 'New York, USA', lastActive: '2 minutes ago', current: true },
      { device: 'Windows PC', location: 'New York, USA', lastActive: '2 days ago', current: false }
    ]
  };
  
  const activityData = {
    lastLogin: '2 hours ago',
    recentBets: [
      { event: 'Lakers vs Warriors', amount: '120', outcome: 'Won', date: '3 days ago' },
      { event: 'Bitcoin Price Prediction', amount: '50', outcome: 'Lost', date: '5 days ago' },
      { event: 'Presidential Election', amount: '200', outcome: 'Pending', date: '1 week ago' }
    ],
    totalBets: 24,
    winRate: '67%'
  };
  
  // Add showLogoutModal state variable
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutSessionId, setLogoutSessionId] = useState(null);
  
  // Handle notification toggle
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    bettingReminders: true,
    specialOffers: false
  });
  
  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  // Fetch or initialize profile data
  useEffect(() => {
    if (isLoaded && user) {
      // Placeholder for API call - would actually fetch from backend
      // For now, initialize with user data from Clerk
      setProfileData({
        username: user.username || user.fullName || 'User',
        bio: 'Hi there! I love using Predixor for betting on my favorite events. Always looking for the next big prediction opportunity!',
        location: 'New York, USA',
        website: 'https://example.com',
        occupation: 'Financial Analyst',
        favoriteCategories: ['Sports', 'Crypto', 'Politics', 'Entertainment']
      });
    }
  }, [isLoaded, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleCategoryToggle = (category) => {
    if (profileData.favoriteCategories.includes(category)) {
      setProfileData({
        ...profileData,
        favoriteCategories: profileData.favoriteCategories.filter(cat => cat !== category)
      });
    } else {
      setProfileData({
        ...profileData,
        favoriteCategories: [...profileData.favoriteCategories, category]
      });
    }
  };

  const saveChanges = () => {
    // Would call API to save changes
    console.log('Saving profile changes:', profileData);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    // Reset to original data
    if (isLoaded && user) {
      setProfileData({
        username: user.username || user.fullName || 'User',
        bio: 'Hi there! I love using Predixor for betting on my favorite events. Always looking for the next big prediction opportunity!',
        location: 'New York, USA',
        website: 'https://example.com',
        occupation: 'Financial Analyst',
        favoriteCategories: ['Sports', 'Crypto', 'Politics', 'Entertainment']
      });
    }
    setIsEditing(false);
  };

  // Add function to handle logout button click
  const handleLogoutClick = (sessionId) => {
    setLogoutSessionId(sessionId);
    setShowLogoutModal(true);
  };

  // Add function to handle actual logout
  const handleLogout = () => {
    // Call API to log out the session
    console.log(`Logging out session: ${logoutSessionId}`);
    setShowLogoutModal(false);
    // In a real implementation, this would call an API to invalidate the session
  };

  // Handle notification toggle
  const handleNotificationToggle = (preference) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
    
    // In a real app, you would save this to the backend here
    console.log(`${preference} toggled to ${!notificationPreferences[preference]}`);
    
    // Show feedback to user
    const message = document.createElement('div');
    message.className = 'preference-saved';
    message.textContent = `${preference} ${!notificationPreferences[preference] ? 'enabled' : 'disabled'}`;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 2000);
  };

  return (
    <div className="profile-page-container" data-theme={theme}>
      <div className="back-to-dashboard">
        <Link to="/home" className="back-link">
          <FaChevronLeft /> Back to Dashboard
        </Link>
      </div>
      <div className={`profile-header ${activeSection === 'personal' ? 'personal-active' : ''}`}>
        <div className="profile-title-section">
          <h1>My Profile</h1>
          <p className="profile-subtitle">Manage your personal information and account preferences</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="edit-buttons">
              <button className="save-profile-btn" onClick={saveChanges}>
                <FaSave /> Save Changes
              </button>
              <button className="cancel-edit-btn" onClick={cancelEdit}>
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar" >
          <div className="profile-image-container">
            <img 
              src={isLoaded && user?.imageUrl ? user.imageUrl : '/default-avatar.png'} 
              alt="Profile" 
              className="profile-image"
            />
            {isEditing && (
              <div className="change-photo-overlay">
                <FaCamera className="camera-icon" />
                <span>Update Photo</span>
              </div>
            )}
          </div>
          
          <div className="user-info-summary">
            <h2>{profileData.username}</h2>
            <p className="user-email">{isLoaded && user?.primaryEmailAddress?.emailAddress}</p>
            <div className="user-location">
              <FaMapMarkerAlt /> {profileData.location}
            </div>
            {profileData.website && (
              <div className="user-website">
                <FaGlobe /> <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website.replace(/^https?:\/\//, '')}</a>
              </div>
            )}
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <h3>Total Bets</h3>
              <p>{activityData.totalBets}</p>
            </div>
            <div className="stat-item">
              <h3>Win Rate</h3>
              <p>{activityData.winRate}</p>
            </div>
            <div className="stat-item">
              <h3>Balance</h3>
              <p>{userData?.wallet?.totalBalance?.toFixed(2) || '0.00'} PDX</p>
            </div>
          </div>
          
          <div className="sidebar-nav">
            <button 
              className={`sidebar-nav-item ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              <FaUser className="nav-icon" /> Personal Info
            </button>
            <button 
              className={`sidebar-nav-item ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              <FaShieldAlt className="nav-icon" /> Security & Devices
            </button>
            <button 
              className={`sidebar-nav-item ${activeSection === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveSection('activity')}
            >
              <FaHistory className="nav-icon" /> Activity & Bets
            </button>
            <button 
              className={`sidebar-nav-item ${activeSection === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveSection('preferences')}
            >
              <FaCalendarAlt className="nav-icon" /> Preferences
            </button>
            <Link to="/home/settings" className="sidebar-nav-item">
              <FaCog className="nav-icon" /> Settings
            </Link>
          </div>
        </div>

        <div className="profile-details">
          {/* Personal Information */}
          {activeSection === 'personal' && (
            <div className="detail-section animate-in">
              <h2><FaUser /> Personal Information</h2>
              <div className="detail-content">
                <div className="detail-field">
                  <label>Username</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{profileData.username}</p>
                  )}
                </div>

                <div className="detail-field">
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  ) : (
                    <p>{profileData.bio}</p>
                  )}
                </div>
                
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Location</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p><FaMapMarkerAlt className="field-icon" /> {profileData.location}</p>
                    )}
                  </div>

                  <div className="detail-field">
                    <label>Website</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="website"
                        value={profileData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                      />
                    ) : (
                      <p>
                        {profileData.website ? (
                          <>
                            <FaLink className="field-icon" /> 
                            <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                              {profileData.website.replace(/^https?:\/\//, '')}
                            </a>
                          </>
                        ) : (
                          'Not specified'
                        )}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="detail-grid">
                  <div className="detail-field">
                    <label>Occupation</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="occupation"
                        value={profileData.occupation}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p><FaBriefcase className="field-icon" /> {profileData.occupation}</p>
                    )}
                  </div>

                  <div className="detail-field">
                    <label>Email Address</label>
                    <p>
                      <FaEnvelope className="field-icon" /> 
                      {isLoaded && user?.primaryEmailAddress?.emailAddress || 'Email not available'}
                    </p>
                    <small>Email address is managed through your account settings</small>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="detail-section animate-in">
              <h2><FaShieldAlt /> Security & Devices</h2>
              
              <div className="security-status">
                <h3>Account Security</h3>
                <div className="security-item">
                  <div className="security-label">
                    <span>Password</span>
                    <span className="security-status-info">Last changed {securityData.lastPasswordChange}</span>
                  </div>
                  <button className="security-action-btn">Change Password</button>
                </div>
                
                <div className="security-item">
                  <div className="security-label">
                    <span>Two-Factor Authentication</span>
                    <span className={`security-status-badge ${securityData.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                      {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <button className="security-action-btn">
                    {securityData.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
              
              <div className="active-sessions">
                <h3>Active Sessions</h3>
                {securityData.activeSessions.map((session, index) => (
                  <div key={index} className={`session-item ${session.current ? 'current' : ''}`}>
                    <div className="session-icon">
                      {session.device.includes('iPhone') || session.device.includes('Android') ? 
                        <FaMobile /> : <FaLaptop />}
                    </div>
                    <div className="session-details">
                      <div className="session-device">{session.device}</div>
                      <div className="session-meta">
                        <span>{session.location}</span>
                        <span className="session-time">
                          <FaClock /> {session.lastActive} {session.current && '(Current)'}
                        </span>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="session-logout-btn" onClick={() => handleLogoutClick(session.device)}>Log Out</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Activity Section */}
          {activeSection === 'activity' && (
            <div className="detail-section animate-in">
              <h2><FaHistory /> Activity & Bets</h2>
              
              <div className="login-activity">
                <h3>Account Activity</h3>
                <div className="login-info">
                  <FaClock className="login-icon" />
                  <span>Last login: {activityData.lastLogin}</span>
                </div>
              </div>
              
              <div className="betting-activity">
                <h3>Recent Bets</h3>
                <div className="bets-list">
                  {activityData.recentBets.map((bet, index) => (
                    <div key={index} className="bet-item">
                      <div className="bet-event">{bet.event}</div>
                      <div className="bet-details">
                        <span className="bet-amount"><FaWallet /> {bet.amount} PDX</span>
                        <span className={`bet-outcome ${bet.outcome.toLowerCase()}`}>
                          {bet.outcome === 'Won' && <FaTrophy />} {bet.outcome}
                        </span>
                        <span className="bet-date"><FaCalendarAlt /> {bet.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="view-all-btn">View All Bets</button>
              </div>
              
              <div className="wallet-summary">
                <h3>Wallet Summary</h3>
                <div className="wallet-stats">
                  <div className="wallet-stat-item">
                    <span className="wallet-stat-label">Current Balance</span>
                    <span className="wallet-stat-value">{userData?.wallet?.totalBalance?.toFixed(2) || '0.00'} PDX</span>
                  </div>
                  <div className="wallet-stat-item">
                    <span className="wallet-stat-label">Total Deposited</span>
                    <span className="wallet-stat-value">1,200.00 PDX</span>
                  </div>
                  <div className="wallet-stat-item">
                    <span className="wallet-stat-label">Total Withdrawn</span>
                    <span className="wallet-stat-value">500.00 PDX</span>
                  </div>
                </div>
                <Link to="/home/wallet" className="wallet-link-btn">Manage Wallet</Link>
              </div>
            </div>
          )}
          
          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <div className="detail-section animate-in">
              <h2><FaCalendarAlt /> Preferences</h2>
              <div className="detail-content">
                <div className="detail-field">
                  <label>Favorite Categories</label>
                  {isEditing ? (
                    <div className="category-toggles">
                      {['Sports', 'Politics', 'Entertainment', 'Finance', 'Technology', 'Crypto', 'E-Sports'].map(category => (
                        <div 
                          key={category}
                          className={`category-toggle ${profileData.favoriteCategories.includes(category) ? 'active' : ''}`}
                          onClick={() => handleCategoryToggle(category)}
                        >
                          <FaUserTag className="category-icon" /> {category}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="category-tags">
                      {profileData.favoriteCategories.map(category => (
                        <span key={category} className="category-tag">
                          <FaUserTag className="category-icon" /> {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="preference-group">
                  <h3>Notification Preferences</h3>
                  <div className="preference-toggle">
                    <span>Email Notifications</span>
                    <button 
                      className={`toggle-btn ${notificationPreferences.emailNotifications ? 'active' : ''}`}
                      onClick={() => handleNotificationToggle('emailNotifications')}
                    >
                      {notificationPreferences.emailNotifications ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div className="preference-toggle">
                    <span>Betting Reminders</span>
                    <button 
                      className={`toggle-btn ${notificationPreferences.bettingReminders ? 'active' : ''}`}
                      onClick={() => handleNotificationToggle('bettingReminders')}
                    >
                      {notificationPreferences.bettingReminders ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  <div className="preference-toggle">
                    <span>Special Offers</span>
                    <button 
                      className={`toggle-btn ${notificationPreferences.specialOffers ? 'active' : ''}`}
                      onClick={() => handleNotificationToggle('specialOffers')}
                    >
                      {notificationPreferences.specialOffers ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
                
                <div className="preference-group">
                  <h3>Bet Display</h3>
                  <div className="preference-select">
                    <span>Odds Format</span>
                    <select className="preference-dropdown">
                      <option value="decimal">Decimal (1.95)</option>
                      <option value="american">American (-105)</option>
                      <option value="fractional">Fractional (19/20)</option>
                    </select>
                  </div>
                  <div className="preference-select">
                    <span>Default Bet Amount</span>
                    <input type="number" className="preference-input" value="50" min="1" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add this right before the closing return tag (before the final </div>) */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <FaSignOutAlt className="modal-icon" />
            <h2 className="modal-title">Confirm Logout</h2>
            <p className="modal-message">
              Are you sure you want to log out of this session? You will need to sign in again to access your account.
            </p>
            <div className="modal-buttons">
              <button 
                className="modal-btn modal-btn-cancel" 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-logout" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 