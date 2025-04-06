import React, { useState, useEffect, useRef } from 'react';
import './navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useModal } from '../../context/ModalContext';
import { useUser as useClerkUser, useClerk } from '@clerk/clerk-react';
import { FaMoon, FaSun, FaUserAlt, FaCog, FaSignOutAlt, FaChevronDown, FaCoins, FaGift, FaQuestionCircle, FaUsers } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { userData } = useUser();
  const { user, isLoaded } = useClerkUser();
  const { isAnyModalOpen } = useModal();
  const profileMenuRef = useRef(null);
  const moreMenuRef = useRef(null);
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch wallet balance from backend
  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (isLoaded && user) {
        try {
          const response = await axios.get(`/api/users/${user.id}/wallet`);
          if (response.data && response.data.balance) {
            setWalletBalance(response.data.balance);
          }
        } catch (error) {
          console.error('Error fetching wallet balance:', error);
        }
      }
    };
    
    fetchWalletBalance();
    
    // Refresh wallet balance every 30 seconds
    const intervalId = setInterval(fetchWalletBalance, 30000);
    
    return () => clearInterval(intervalId);
  }, [isLoaded, user]);

  // Watch for theme changes from localStorage
  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('theme') || 'dark';
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('themeChanged', handleThemeChange);

    // Set initial theme
    document.documentElement.setAttribute('data-theme', theme);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, [theme]);

  // Track scroll state
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreDropdown && 
          moreMenuRef.current && 
          !moreMenuRef.current.contains(event.target) && 
          !event.target.closest('.more-menu-container')) {
        setShowMoreDropdown(false);
      }
      
      if (showProfileDropdown && 
          profileMenuRef.current && 
          !profileMenuRef.current.contains(event.target) && 
          !event.target.closest('.profile-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreDropdown, showProfileDropdown]);

  const toggleMoreDropdown = () => {
    setShowMoreDropdown(!showMoreDropdown);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('themeChanged'));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isAnyModalOpen ? 'modal-open' : ''}`} data-theme={theme}>
      <div className="nav-content">
        <Link to="/home" className="predixor-logo">
          <h1 className="logo-text" style={{ fontSize: '57px',fontFamily:'Poppins' }}>
            <span>Pred</span><span className="logo-accent">ixor</span>
          </h1>
        </Link>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ul className="nav-links">
            <li>
              <Link
                to='/home'
                className={location.pathname === '/home' ? 'active' : ''}
              >
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/home/events"
                className={location.pathname === '/home/events' ? 'active' : ''}
              >
                <span>Events</span>
              </Link>
            </li>
            <li className="more-menu-container">
              <div 
                className={`more-menu-button ${showMoreDropdown ? 'active' : ''}`}
                onClick={toggleMoreDropdown}
              >
                More          
                <FaChevronDown className="dropdown-icon" />
              </div>
              
              {showMoreDropdown && (
                <div className="more-dropdown" ref={moreMenuRef}>
                  <Link to="/home/wallet" className="dropdown-item">
                    <span>Wallet</span>
                  </Link>
                  <Link to="/home/help" className="dropdown-item">
                    <span>Help</span>
                  </Link>
                  <Link to="/home/community" className="dropdown-item">
                    <span>Community</span>
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>

        <div className="profile-section">
          <div className="wallet-rewards-container">
            <div className="wallet-info">
              <Link to="/home/wallet" className="wallet-link-mini">
                <span className="balance">
                  <FaCoins className="coin-icon" />
                  {walletBalance.toFixed(2) || '0.00'}
                </span>
              </Link>
              <Link to="/home/rewards" className="rewards-link-mini">
                <FaGift className="rewards-icon" />
              </Link>
            </div>
          </div>
          <div className="profile-container" onClick={toggleProfileDropdown}>
            <img 
              src={isLoaded && user?.imageUrl ? user.imageUrl : '/default-avatar.png'} 
              alt="Profile" 
              className="profile-picture"
            />
            <FaChevronDown className="profile-dropdown-icon" />
            
            {showProfileDropdown && (
              <div className="profile-dropdown" ref={profileMenuRef}>
                <Link to="/home/profile" className="dropdown-item">
                  <FaUserAlt className="dropdown-icon" />
                  <span>Profile</span>
                </Link>
                <Link to="/home/settings" className="dropdown-item">
                  <FaCog className="dropdown-icon" />
                  <span>Settings</span>
                </Link>
                <div className="dropdown-divider"></div>
                <div 
                  className="dropdown-item logout" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLogoutConfirm(true);
                  }}
                >
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
          <button className="theme-toggle-container" onClick={toggleTheme}>
            {theme === 'dark' ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="logout-modal-buttons">
              <button className="cancel-button" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
