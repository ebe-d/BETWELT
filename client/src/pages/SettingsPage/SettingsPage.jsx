import React, { useState, useEffect, useRef } from 'react';
import './settingspage.css';
import { Link } from 'react-router-dom';
import { 
  FaCog, FaBell, FaShieldAlt, FaWallet, FaToggleOn, FaToggleOff, 
  FaCheck, FaTimes, FaArrowLeft, FaUser, FaGlobe, FaChartLine, 
  FaLock, FaEyeSlash, FaBan, FaRegSave, FaTrash, FaKey
} from 'react-icons/fa';

// Add an API object to handle backend interactions
const SettingsAPI = {
  // Only a few critical settings will interact with backend
  saveSettings: async (settings) => {
    // Simulating API call
    console.log('Saving settings to backend:', settings);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 800);
    });
  },
  
  // Separate functions for critical settings
  updateSecurity: async (securitySettings) => {
    console.log('Updating security settings:', securitySettings);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 600);
    });
  },
  
  updateEmailPreferences: async (emailSettings) => {
    console.log('Updating email preferences:', emailSettings);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },
  
  requestAccountDeletion: async () => {
    console.log('Requesting account deletion');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Deletion request submitted' });
      }, 1000);
    });
  }
};

const SettingsPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      news: false,
      marketUpdates: true,
      betResults: true
    },
    privacy: {
      showActivity: true,
      showStatistics: true,
      publicProfile: false
    },
    security: {
      twoFactorAuth: false,
      requirePasswordForWithdrawals: true,
      loginNotifications: true
    },
    preferences: {
      showOddsAs: 'decimal',
      defaultBetAmount: 10,
      autoAcceptOddsChanges: false,
      showBetHistory: true
    }
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  // Animate section changes
  useEffect(() => {
    if (sectionRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 400); // Match the animation duration in CSS
      
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleToggle = (category, setting) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    };
    
    setSettings(newSettings);
    
    // Show mini success notification
    showMiniSuccess(`${setting} ${!settings[category][setting] ? 'enabled' : 'disabled'}`);
    
    // If this is a security setting, update backend immediately
    if (category === 'security' && (setting === 'twoFactorAuth' || setting === 'requirePasswordForWithdrawals')) {
      SettingsAPI.updateSecurity({
        [setting]: !settings[category][setting]
      });
    }
    
    // If this is an email setting, update backend immediately
    if (category === 'notifications' && setting === 'email') {
      SettingsAPI.updateEmailPreferences({
        [setting]: !settings[category][setting]
      });
    }
  };

  const handleInputChange = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };

  const showMiniSuccess = (message) => {
    const miniMessage = document.createElement('div');
    miniMessage.className = 'mini-success';
    miniMessage.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(miniMessage);
    
    setTimeout(() => {
      miniMessage.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      miniMessage.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(miniMessage);
      }, 300);
    }, 2000);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Only send critical settings to backend
      const backendSettings = {
        security: {
          twoFactorAuth: settings.security.twoFactorAuth,
          requirePasswordForWithdrawals: settings.security.requirePasswordForWithdrawals
        },
        notifications: {
          email: settings.notifications.email,
          news: settings.notifications.news
        }
      };
      
      // Call API for backend settings
      const result = await SettingsAPI.saveSettings(backendSettings);
      
      if (result.success) {
        // Save all settings to localStorage for frontend settings
        localStorage.setItem('userSettings', JSON.stringify(settings));
        setSuccessMessage('Settings updated successfully!');
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Failed to save settings. Please try again.');
      
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (tabId) => {
    if (activeTab !== tabId) {
      setIsAnimating(true);
      setActiveTab(tabId);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: FaCog },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'privacy', label: 'Privacy & Security', icon: FaShieldAlt },
    { id: 'preferences', label: 'Betting Preferences', icon: FaWallet }
  ];

  return (
    <div className="settings-page-container" data-theme={theme}>
      <div className="settings-header">
        <div className="settings-title-area">
          <Link to="/home" className="back-link">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1>Settings</h1>
        </div>
        <button className="save-settings-btn" onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="spinner"></div> Saving...
            </>
          ) : (
            <>
              <FaRegSave className="save-icon" /> Save Changes
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="success-message">
          <FaCheck className="success-icon" /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <FaTimes className="error-icon" /> {errorMessage}
        </div>
      )}

      <div className="settings-content">
        <div className="settings-sidebar">
          <ul className="settings-tabs">
            {tabs.map(tab => (
              <li 
                key={tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => handleTabChange(tab.id)}
              >
                <tab.icon className="tab-icon" />
                <span>{tab.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="settings-main">
          <div ref={sectionRef} className={`settings-section ${isAnimating ? 'animating' : ''}`}>
            {/* Account Settings */}
            {activeTab === 'account' && (
              <>
                <h2>Account Settings</h2>
                <p className="settings-description">Manage your account settings and preferences</p>
                
                <div className="settings-group">
                  <h3><FaUser className="heading-icon" /> Profile Information</h3>
                  <div className="settings-info">
                    <p>Update your profile information from the Profile page</p>
                    <a href="/home/profile" className="settings-link">Go to Profile</a>
                  </div>
                </div>

                <div className="settings-group">
                  <h3><FaGlobe className="heading-icon" /> Theme & Appearance</h3>
                  <div className="settings-row">
                    <span className="setting-label">Display Language</span>
                    <select className="settings-select" onChange={() => showMiniSuccess("Language preference saved")}>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="settings-group">
                  <h3><FaLock className="heading-icon" /> Account Actions</h3>
                  <div className="settings-actions">
                    <button 
                      className="change-password-btn"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <FaKey /> Change Password
                    </button>
                    <button 
                      className="delete-account-btn"
                      onClick={() => setShowConfirmModal(true)}
                    >
                      <FaTrash /> Delete Account
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <>
                <h2>Notification Settings</h2>
                <p className="settings-description">Control what notifications you receive</p>
                
                <div className="settings-group">
                  <h3><FaBell className="heading-icon" /> Communication Channels</h3>
                  <div className="settings-row backend-critical">
                    <span className="setting-label">Email Notifications</span>
                    <div className="settings-tooltip">This setting is synced with the server</div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('notifications', 'email')}
                    >
                      {settings.notifications.email 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                  <div className="settings-row">
                    <span className="setting-label">Push Notifications</span>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('notifications', 'push')}
                    >
                      {settings.notifications.push 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <h3><FaChartLine className="heading-icon" /> Event Notifications</h3>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Bet Results</span>
                      <p className="setting-description">Receive updates when your bets are settled</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('notifications', 'betResults')}
                    >
                      {settings.notifications.betResults 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Market Updates</span>
                      <p className="setting-description">Get notified about odds changes in your favorites</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('notifications', 'marketUpdates')}
                    >
                      {settings.notifications.marketUpdates 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">News & Promotions</span>
                      <p className="setting-description">Stay up to date with our latest offers</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('notifications', 'news')}
                    >
                      {settings.notifications.news 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Privacy & Security Settings */}
            {activeTab === 'privacy' && (
              <>
                <h2>Privacy & Security</h2>
                <p className="settings-description">Manage your security settings and privacy preferences</p>
                
                <div className="settings-group">
                  <h3><FaEyeSlash className="heading-icon" /> Privacy</h3>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Show my betting activity</span>
                      <p className="setting-description">Let others see your recent bets</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('privacy', 'showActivity')}
                    >
                      {settings.privacy.showActivity 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Show my statistics</span>
                      <p className="setting-description">Display your betting performance publicly</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('privacy', 'showStatistics')}
                    >
                      {settings.privacy.showStatistics 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Public profile</span>
                      <p className="setting-description">Make your profile visible to other users</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('privacy', 'publicProfile')}
                    >
                      {settings.privacy.publicProfile 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <h3><FaShieldAlt className="heading-icon" /> Security</h3>
                  <div className="settings-row backend-critical">
                    <span className="setting-label">Two-Factor Authentication</span>
                    <div className="settings-tooltip">This setting is synced with the server</div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('security', 'twoFactorAuth')}
                    >
                      {settings.security.twoFactorAuth 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                  <div className="settings-row backend-critical">
                    <span className="setting-label">Password For Withdrawals</span>
                    <div className="settings-tooltip">This setting is synced with the server</div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('security', 'requirePasswordForWithdrawals')}
                    >
                      {settings.security.requirePasswordForWithdrawals 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Login notifications</span>
                      <p className="setting-description">Get notified of new login attempts</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('security', 'loginNotifications')}
                    >
                      {settings.security.loginNotifications 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Betting Preferences */}
            {activeTab === 'preferences' && (
              <>
                <h2>Betting Preferences</h2>
                <p className="settings-description">Customize your betting experience</p>
                
                <div className="settings-group">
                  <h3><FaGlobe className="heading-icon" /> Display Preferences</h3>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Show odds as</span>
                      <p className="setting-description">Choose your preferred odds format</p>
                    </div>
                    <select 
                      className="settings-select"
                      value={settings.preferences.showOddsAs}
                      onChange={(e) => {
                        handleInputChange('preferences', 'showOddsAs', e.target.value);
                        showMiniSuccess("Odds format updated");
                      }}
                    >
                      <option value="decimal">Decimal (1.50)</option>
                      <option value="fractional">Fractional (1/2)</option>
                      <option value="american">American (+150)</option>
                    </select>
                  </div>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Show bet history</span>
                      <p className="setting-description">Display your betting history on your profile</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('preferences', 'showBetHistory')}
                    >
                      {settings.preferences.showBetHistory 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <h3><FaWallet className="heading-icon" /> Betting Defaults</h3>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Default bet amount (PDX)</span>
                      <p className="setting-description">Set your default betting amount</p>
                    </div>
                    <input 
                      type="number" 
                      className="settings-input"
                      value={settings.preferences.defaultBetAmount}
                      onChange={(e) => {
                        handleInputChange('preferences', 'defaultBetAmount', parseInt(e.target.value));
                        if (e.target.value >= 1 && e.target.value <= 1000) {
                          showMiniSuccess("Default bet amount saved");
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value < 1) {
                          handleInputChange('preferences', 'defaultBetAmount', 1);
                          showMiniSuccess("Minimum bet amount is 1 PDX");
                        } else if (e.target.value > 1000) {
                          handleInputChange('preferences', 'defaultBetAmount', 1000);
                          showMiniSuccess("Maximum bet amount is 1000 PDX");
                        }
                      }}
                      min="1"
                      max="1000"
                    />
                  </div>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Auto-accept odds changes</span>
                      <p className="setting-description">Automatically accept changes in odds when placing bets</p>
                    </div>
                    <div 
                      className="toggle-switch"
                      onClick={() => handleToggle('preferences', 'autoAcceptOddsChanges')}
                    >
                      {settings.preferences.autoAcceptOddsChanges 
                        ? <FaToggleOn className="toggle-icon on" /> 
                        : <FaToggleOff className="toggle-icon off" />
                      }
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <h3><FaBan className="heading-icon" /> Responsible Gambling</h3>
                  <div className="settings-row">
                    <div className="setting-item">
                      <span className="setting-label">Deposit limit (PDX per day)</span>
                      <p className="setting-description">Set a daily limit for deposits</p>
                    </div>
                    <input 
                      type="number" 
                      className="settings-input"
                      placeholder="No limit"
                      min="0"
                      onChange={() => showMiniSuccess("Deposit limit updated")}
                    />
                  </div>
                  <div className="settings-info">
                    <p>Set personal betting limits to ensure responsible gambling. These limits help you stay in control of your betting activities.</p>
                    <a href="/home/help" className="settings-link">Learn More</a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FaTrash className="modal-icon" /> Delete Account</h3>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p className="warning-text">Are you sure you want to delete your account? This action cannot be undone.</p>
              <p>All your data, including betting history and wallet information, will be permanently removed.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className="modal-confirm">
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FaKey className="modal-icon" /> Change Password</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="modal-input" placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="modal-input" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="modal-input" placeholder="Confirm new password" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button className="modal-confirm">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage; 