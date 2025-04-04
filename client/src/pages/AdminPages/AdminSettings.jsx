import React, { useState, useEffect } from 'react';
import './admindashboard.css';
import './adminsettings.css';
import { 
  FaCog, 
  FaShieldAlt, 
  FaServer, 
  FaSave, 
  FaDownload, 
  FaUpload, 
  FaBroom,
  FaExclamationTriangle,
  FaGlobe,
  FaEnvelope,
  FaUsers,
  FaLock,
  FaUnlock,
  FaToggleOn,
  FaToggleOff,
  FaDatabase,
  FaTimes,
  FaCalendarAlt,
  FaLanguage
} from 'react-icons/fa';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [confirmAction, setConfirmAction] = useState('');
  const [backupHistory, setBackupHistory] = useState([]);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  
  // Form state
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Predixor Betting Platform',
    siteDescription: 'The premier platform for sports and event betting',
    supportEmail: 'support@predixor.com',
    maxBetAmount: 10000,
    minBetAmount: 5,
    logoUrl: '/assets/logo.png',
    currencySymbol: 'PDX',
    timeZone: 'UTC',
    defaultLanguage: 'en',
    maintenanceMode: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiration: 90,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    requireStrongPasswords: true,
    allowSocialLogin: true,
    ipRestriction: false,
    adminIpWhitelist: '',
    autoLockAccounts: true,
    dataEncryption: true
  });
  
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    automaticBackup: true,
    backupFrequency: 'daily',
    cleanupOldData: true,
    dataRetentionDays: 365,
    logLevel: 'info',
    errorReporting: true,
    analyticsTracking: true,
    performanceMonitoring: true,
    apiRateLimit: 100,
    databaseOptimization: true
  });
  
  useEffect(() => {
    // Simulate loading settings from API
    const loadSettings = async () => {
      setLoading(true);
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock backup history
        const mockBackups = [
          { id: 'BKP-001', date: '2023-08-15T08:00:00', size: '24.5 MB', status: 'completed' },
          { id: 'BKP-002', date: '2023-08-14T08:00:00', size: '24.3 MB', status: 'completed' },
          { id: 'BKP-003', date: '2023-08-13T08:00:00', size: '24.1 MB', status: 'completed' },
          { id: 'BKP-004', date: '2023-08-12T08:00:00', size: '23.9 MB', status: 'completed' },
          { id: 'BKP-005', date: '2023-08-11T08:00:00', size: '23.7 MB', status: 'completed' }
        ];
        
        setBackupHistory(mockBackups);
        setLoading(false);
      } catch (error) {
        console.error("Error loading settings:", error);
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle form submission
  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Simulate API call to save settings
    console.log("Saving settings...");
    console.log("Site settings:", siteSettings);
    console.log("Security settings:", securitySettings);
    console.log("Maintenance settings:", maintenanceSettings);
    
    // Show success message
    alert("Settings saved successfully!");
  };
  
  // Update site settings
  const handleSiteSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSiteSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Update security settings
  const handleSecuritySettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Update maintenance settings
  const handleMaintenanceSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMaintenanceSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle backup actions
  const handleBackupAction = (action) => {
    setConfirmAction(action);
    setShowBackupModal(true);
  };
  
  // Handle maintenance mode actions
  const handleMaintenanceAction = () => {
    setShowMaintenanceModal(true);
  };
  
  // Execute backup action
  const executeBackupAction = () => {
    // Simulate backup
    alert(`Executing ${confirmAction} operation...`);
    setShowBackupModal(false);
    
    // Add a new backup to the list (in real app, this would be done after API response)
    if (confirmAction === 'backup') {
      const newBackup = {
        id: `BKP-00${backupHistory.length + 1}`,
        date: new Date().toISOString(),
        size: '24.8 MB',
        status: 'completed'
      };
      
      setBackupHistory([newBackup, ...backupHistory]);
    }
    
    setConfirmAction('');
  };
  
  // Execute maintenance mode toggle
  const executeMaintenanceMode = () => {
    // Update both state variables for consistency
    const newMaintenanceMode = !siteSettings.maintenanceMode;
    
    setMaintenanceMode(newMaintenanceMode);
    setSiteSettings(prev => ({
      ...prev,
      maintenanceMode: newMaintenanceMode
    }));
    
    setShowMaintenanceModal(false);
    
    // Show feedback
    alert(`Maintenance mode ${newMaintenanceMode ? 'enabled' : 'disabled'}`);
  };
  
  // Close modals
  const closeModal = () => {
    setShowBackupModal(false);
    setShowMaintenanceModal(false);
    setConfirmAction('');
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Settings</h1>
        <p className="page-description">Configure platform settings, security, notifications, and maintenance options.</p>
      </div>
      
      <div className="settings-grid">
        {/* Site Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <FaGlobe />
            </div>
            <h2>Site Settings</h2>
          </div>
          
          <form className="settings-form">
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input 
                type="text" 
                id="siteName" 
                name="siteName" 
                value={siteSettings.siteName} 
                onChange={handleSiteSettingChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="siteDescription">Site Description</label>
              <textarea 
                id="siteDescription" 
                name="siteDescription" 
                value={siteSettings.siteDescription} 
                onChange={handleSiteSettingChange}
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="supportEmail">
                  <FaEnvelope className="form-icon" /> Support Email
                </label>
                <input 
                  type="email" 
                  id="supportEmail" 
                  name="supportEmail" 
                  value={siteSettings.supportEmail} 
                  onChange={handleSiteSettingChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currencySymbol">Currency Symbol</label>
                <input 
                  type="text" 
                  id="currencySymbol" 
                  name="currencySymbol" 
                  value={siteSettings.currencySymbol} 
                  onChange={handleSiteSettingChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minBetAmount">Minimum Bet (PDX)</label>
                <input 
                  type="number" 
                  id="minBetAmount" 
                  name="minBetAmount" 
                  value={siteSettings.minBetAmount} 
                  onChange={handleSiteSettingChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="maxBetAmount">Maximum Bet (PDX)</label>
                <input 
                  type="number" 
                  id="maxBetAmount" 
                  name="maxBetAmount" 
                  value={siteSettings.maxBetAmount} 
                  onChange={handleSiteSettingChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="defaultLanguage">
                  <FaLanguage className="form-icon" /> Default Language
                </label>
                <select 
                  id="defaultLanguage" 
                  name="defaultLanguage" 
                  value={siteSettings.defaultLanguage} 
                  onChange={handleSiteSettingChange}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="timeZone">
                  <FaCalendarAlt className="form-icon" /> Time Zone
                </label>
                <select 
                  id="timeZone" 
                  name="timeZone" 
                  value={siteSettings.timeZone} 
                  onChange={handleSiteSettingChange}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST (Eastern)</option>
                  <option value="CST">CST (Central)</option>
                  <option value="MST">MST (Mountain)</option>
                  <option value="PST">PST (Pacific)</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        
        {/* Security Settings */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <FaShieldAlt />
            </div>
            <h2>Security Settings</h2>
          </div>
          
          <form className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="maxLoginAttempts">Max Login Attempts</label>
                <input 
                  type="number" 
                  id="maxLoginAttempts" 
                  name="maxLoginAttempts" 
                  value={securitySettings.maxLoginAttempts} 
                  onChange={handleSecuritySettingChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="passwordExpiration">Password Expiry (days)</label>
                <input 
                  type="number" 
                  id="passwordExpiration" 
                  name="passwordExpiration" 
                  value={securitySettings.passwordExpiration} 
                  onChange={handleSecuritySettingChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                <input 
                  type="number" 
                  id="sessionTimeout" 
                  name="sessionTimeout" 
                  value={securitySettings.sessionTimeout} 
                  onChange={handleSecuritySettingChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="adminIpWhitelist">Admin IP Whitelist</label>
                <input 
                  type="text" 
                  id="adminIpWhitelist" 
                  name="adminIpWhitelist" 
                  value={securitySettings.adminIpWhitelist} 
                  onChange={handleSecuritySettingChange}
                  placeholder="Comma separated IPs"
                  disabled={!securitySettings.ipRestriction}
                />
              </div>
            </div>
            
            <div className="security-options-grid">
              <div className="security-option">
                <div className="form-group checkbox">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="twoFactorAuth" 
                      name="twoFactorAuth" 
                      checked={securitySettings.twoFactorAuth} 
                      onChange={handleSecuritySettingChange}
                    />
                    <label htmlFor="twoFactorAuth">
                      {securitySettings.twoFactorAuth ? <FaToggleOn /> : <FaToggleOff />}
                      Require 2FA
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="security-option">
                <div className="form-group checkbox">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="requireStrongPasswords" 
                      name="requireStrongPasswords" 
                      checked={securitySettings.requireStrongPasswords} 
                      onChange={handleSecuritySettingChange}
                    />
                    <label htmlFor="requireStrongPasswords">
                      {securitySettings.requireStrongPasswords ? <FaToggleOn /> : <FaToggleOff />}
                      Require Strong Passwords
                    </label>
                  </div>
                </div>
              </div>
            
              <div className="security-option">
                <div className="form-group checkbox">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="allowSocialLogin" 
                      name="allowSocialLogin" 
                      checked={securitySettings.allowSocialLogin} 
                      onChange={handleSecuritySettingChange}
                    />
                    <label htmlFor="allowSocialLogin">
                      {securitySettings.allowSocialLogin ? <FaToggleOn /> : <FaToggleOff />}
                      Allow Social Login
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="security-option">
                <div className="form-group checkbox">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="ipRestriction" 
                      name="ipRestriction" 
                      checked={securitySettings.ipRestriction} 
                      onChange={handleSecuritySettingChange}
                    />
                    <label htmlFor="ipRestriction">
                      {securitySettings.ipRestriction ? <FaToggleOn /> : <FaToggleOff />}
                      Enable IP Restriction for Admin
                    </label>
                  </div>
                </div>
              </div>
            
              <div className="security-option">
                <div className="form-group checkbox">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="autoLockAccounts" 
                      name="autoLockAccounts" 
                      checked={securitySettings.autoLockAccounts} 
                      onChange={handleSecuritySettingChange}
                    />
                    <label htmlFor="autoLockAccounts">
                      {securitySettings.autoLockAccounts ? <FaToggleOn /> : <FaToggleOff />}
                      Auto-lock After Failed Attempts
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="security-option">
                <div className="form-group checkbox">
                  <div className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="dataEncryption" 
                      name="dataEncryption" 
                      checked={securitySettings.dataEncryption} 
                      onChange={handleSecuritySettingChange}
                    />
                    <label htmlFor="dataEncryption">
                      {securitySettings.dataEncryption ? <FaToggleOn /> : <FaToggleOff />}
                      Enable Data Encryption
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        
        {/* Maintenance Mode */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon">
              <FaServer />
            </div>
            <h2>Maintenance Mode</h2>
          </div>
          
          <form className="settings-form">
            <div className="form-row checkboxes">
              <div className="form-group checkbox">
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="maintenanceMode" 
                    name="maintenanceMode" 
                    checked={siteSettings.maintenanceMode} 
                    onChange={handleSiteSettingChange}
                  />
                  <label htmlFor="maintenanceMode">
                    {siteSettings.maintenanceMode ? <FaToggleOn /> : <FaToggleOff />}
                    Maintenance Mode
                  </label>
                </div>
              </div>
            </div>
            
            <div className="maintenance-description">
              <p>
                When maintenance mode is enabled, the site will be unavailable to regular users.
                Only administrators will be able to access the platform.
              </p>
            </div>
            
            <div className="maintenance-actions">
              <button 
                type="button" 
                className="maintenance-btn" 
                onClick={handleMaintenanceAction}
              >
                <FaBroom /> {siteSettings.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="save-settings-btn" onClick={handleSaveSettings}>
          <FaSave /> Save All Settings
        </button>
      </div>
      
      {/* Maintenance Mode Modal */}
      {showMaintenanceModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{siteSettings.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode</h2>
              <button className="close-modal-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="maintenance-modal-content">
                <div className="maintenance-warning">
                  <FaExclamationTriangle className="warning-icon" />
                  <p>
                    {siteSettings.maintenanceMode 
                      ? 'This will take the site out of maintenance mode and make it available to all users.'
                      : 'This will put the site in maintenance mode. Only admins will be able to access the site.'}
                  </p>
                </div>
                
                {!siteSettings.maintenanceMode && (
                  <div className="maintenance-message-input">
                    <label>Maintenance Message (shown to users):</label>
                    <textarea 
                      value={maintenanceMessage}
                      onChange={(e) => setMaintenanceMessage(e.target.value)}
                      placeholder="We're currently performing scheduled maintenance. Please check back soon."
                      rows="3"
                    ></textarea>
                  </div>
                )}
                
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                  <button 
                    className="submit-btn" 
                    onClick={executeMaintenanceMode}
                  >
                    {siteSettings.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
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

export default AdminSettings;
