import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    wallet: {
      totalBalance: 1458.62,
      pendingBalance: 213.45,
      earnedRewards: 78.20
    }
  });

  // Function to update wallet data
  const updateWallet = (newWalletData) => {
    setUserData(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        ...newWalletData
      }
    }));
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, updateWallet }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 