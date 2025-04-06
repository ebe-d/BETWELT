import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaWallet, FaBullseye, 
  FaQuestionCircle, FaUser, FaCog, FaUsers, FaGift } from 'react-icons/fa';
import styles from './sidebar.module.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const { pathname } = useLocation();
  
  const menuItems = [
    { name: 'Home', path: '/home', icon: <FaHome size={20} /> },
    { name: 'Events', path: '/home/events', icon: <FaCalendarAlt size={20} /> },
    { name: 'Community', path: '/home/community', icon: <FaUsers size={20} /> },
    { name: 'Rewards', path: '/home/rewards', icon: <FaGift size={20} /> },
    { name: 'Wallet', path: '/home/wallet', icon: <FaWallet size={20} /> },
    { name: 'Help', path: '/home/help', icon: <FaQuestionCircle size={20} /> },
    { name: 'Profile', path: '/home/profile', icon: <FaUser size={20} /> },
    { name: 'Settings', path: '/home/settings', icon: <FaCog size={20} /> },
  ];

  return (
    <>
      {/* Backdrop when sidebar is open */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className={styles.backdrop}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>BETWELT</div>
        </div>
        
        <nav className={styles.sidebarNav}>
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
              onClick={toggleSidebar}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navText}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
  