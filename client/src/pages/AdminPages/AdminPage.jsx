import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import './admindashboard.css';
import AdminDashboard from './AdminDashboard';
import AdminEvents from './AdminEvents';
import AdminUsers from './AdminUsers';
import AdminTransactions from './AdminTransactions';
import AdminSettings from './AdminSettings';
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaExchangeAlt, 
  FaCog, 
  FaSignOutAlt,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import axios from 'axios';
import { getClerkToken, getAuthHeaders, clearAuthToken } from '../../utils/auth';

const AdminPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initialize authentication as early as possible
  useEffect(() => {
    getClerkToken().then(token => {
      console.log("Auth initialized for admin");
    });
  }, []);

  // Set active tab based on current path
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path) {
      setActiveTab(path);
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      try {
        // For development purposes, just set isAdmin to true
        // In production, this should make a real API call to check admin status
        console.log('Checking admin status with token');
        
        // Option 1: Use this in development to bypass real auth check
        setIsAdmin(true);
        setLoading(false);
        
        // Option 2: In production, uncomment this to use real admin check
        /*
        const response = await axios.get(
          'http://localhost:5000/api/users/checkadmin', 
          getAuthHeaders()
        );
        setIsAdmin(response.data.isAdmin);
        setLoading(false);
        */
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    if (user) {
      checkAdmin();
    }
  }, [user]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Logout
  const handleLogout = () => {
    clearAuthToken();
    navigate('/');
  };

  return (
    <div className="admin-dashboard" data-theme={theme}>
      <aside className="admin-sidebar">
        {/* Admin Logo */}
        <div className="admin-logo">
          <div className="logo-text" style={{ fontSize: '45px' }}>
            Pred<span style={{ fontSize: '42px' }} className="logo-accent">ixor</span>
          </div>
          <span style={{ color:theme === 'dark' ? 'white' : 'black' ,fontWeight:"400",fontSize:"18px", marginTop:20}}>Admin Panel</span>
        </div>
        
        {/* Admin Navigation */}
        <div className="admin-nav">
          <div className="nav-section">
            <span className="nav-section-title">Main</span>
            <Link 
              to="/admin/dashboard" 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaHome className="nav-icon" /> <span>Dashboard</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <span className="nav-section-title">Management</span>
            <Link 
              to="/admin/users" 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers className="nav-icon" /> <span>Users</span>
            </Link>
            
            <Link 
              to="/admin/events" 
              className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <FaCalendarAlt className="nav-icon" /> <span>Events</span>
            </Link>
            
            <Link 
              to="/admin/transactions" 
              className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              <FaExchangeAlt className="nav-icon" /> <span>Transactions</span>
            </Link>
          </div>
          
          <div className="nav-section">
            
            <Link 
              to="/admin/settings" 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FaCog className="nav-icon" /> <span>Settings</span>
            </Link>
          </div>
        </div>
        
        {/* Admin Logout */}
        <div className="admin-logout">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {/* Admin Header */}
        <header className="admin-header">
          <div className="header-spacer"></div>
          <div className="admin-actions">
            <button className="theme-toggle" style={{marginRight:"200px",marginTop:"-4px"}} onClick={toggleTheme}>
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            <div className="admin-profile">
              {user && user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Admin" className="clerk-avatar" />
              ) : (
                <div className="profile-initial">A</div>
              )}
              <span>{user ? user.fullName || 'Admin User' : 'Admin User'}</span>
            </div>
          </div>
        </header>

        {/* Admin Content - Router */}
        <div className="admin-content">
          {!isAdmin ? (
            <div className="admin-access-denied">
              <div className="access-denied-content">
                <div className="access-denied-icon">⚠️</div>
                <h1>Access Denied</h1>
                <p>You don't have permission to access the admin dashboard.</p>
                <a href="/" className="back-to-home">Back to Home</a>
              </div>
            </div>
          ) : loading ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Loading admin dashboard...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/events" element={<AdminEvents />} />
              <Route path="/transactions" element={<AdminTransactions />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage; 