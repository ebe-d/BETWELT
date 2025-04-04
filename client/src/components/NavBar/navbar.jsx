import React, { useState, useEffect, useRef } from 'react';
import './navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useUser as useClerkUser, useClerk } from '@clerk/clerk-react';
import { FaMoon, FaSun, FaUserAlt, FaCog, FaSignOutAlt, FaChevronDown, FaCoins } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { userData } = useUser();
  const { user, isLoaded } = useClerkUser();
  const profileMenuRef = useRef(null);

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
      if (showWalletDropdown && !event.target.closest('.wallet-container')) {
        setShowWalletDropdown(false);
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
  }, [showWalletDropdown, showProfileDropdown]);

  const toggleWalletDropdown = () => {
    setShowWalletDropdown(!showWalletDropdown);
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
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} data-theme={theme}>
      <Link to="/home" className="predixor-logo">
        <h1 className="logo-text" style={{ fontSize: '65px' }}>
          Pred<span className="logo-accent">ixor</span>
        </h1>
      </Link>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ul className="nav-links">
          <li>
            <Link
              to='/home'
              className={location.pathname === '/home' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/home/events"
              className={location.pathname === '/home/events' ? 'active' : ''}
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/home/wallet"
              className={location.pathname === '/home/wallet' ? 'active' : ''}
            >
              Wallet
            </Link>
          </li>
          <li>
            <Link
              to="/home/help"
              className={location.pathname === '/home/help' ? 'active' : ''}
            >
              Help
            </Link>
          </li>
        </ul>
      </div>

      <div className="profile-section">
        <Link to="/home/wallet" className="wallet-link">
          <div className="wallet-info">
            <span className="balance">
              <FaCoins className="coin-icon" />
              {userData?.wallet?.totalBalance?.toFixed(2) || '0.00'}
            </span>
          </div>
        </Link>
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
