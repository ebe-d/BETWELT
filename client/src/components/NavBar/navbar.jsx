import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ imglink }) {
  const location = useLocation();

  // Track scroll state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (link) => {
    // no need for this function unless you're manually setting something
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="predixor-logo">
        <h1 className="gradient-text" style={{ fontSize: 60 }}>
          Predixor
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ul className="nav-links">
          <li>
            <Link
              to='/home#dashboard'
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
              to="/home/myentries"
              className={location.pathname === '/home/myentries' ? 'active' : ''}
            >
              My Entries
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
