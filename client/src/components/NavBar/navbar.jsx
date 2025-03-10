import React, { useState } from 'react';
import './navbar.css';
import { Link, useLocation } from 'react-router-dom';
function Navbar({ imglink }) {
  // Track the active nav item
  const location=useLocation();

  const handleNavClick = (link) => {
    setlocation.pathname(link);
  };

  return (
    <nav className="navbar">
      <div className="predixor-logo">
        <h1 className="gradient-text" style={{ fontSize: 60 }}>
          Predixor
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ul className="nav-links">
          <li>
            <Link to='/home#dashboard'
              onClick={() => handleNavClick('dashboard')}
              className={location.pathname === '/home' ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/home/events"
              onClick={() => handleNavClick('events')}
              className={location.pathname === '/home/events' ? 'active' : ''}
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/home/myentries"
              onClick={() => handleNavClick('myentries')}
              className={location.pathname === '/home/myentries' ? 'active' : ''}
            >
              My Entries
            </Link>
          </li>
          <li>
            <Link
              to="/home/wallet"
              onClick={() => handleNavClick('wallet')}
              className={location.pathname === '/home/wallet' ? 'active' : ''}
            >
              Wallet
            </Link>
          </li>
          <li>
            <Link
              href="/home/help"
              onClick={() => handleNavClick('help')}
              className={location.pathname === '/home/help' ? 'active' : ''}
            >
              Help
            </Link>
          </li>
        </ul>
      </div>

      {/* Avatar Section */}
      <div className="avatar-container">
        <img
          src={imglink || "https://i.pravatar.cc/40"}
          alt="User Avatar"
          className="avatar"
        />
      </div>
    </nav>
  );
}

export default Navbar;
