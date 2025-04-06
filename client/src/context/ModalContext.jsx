import React, { createContext, useContext, useState } from 'react';

// Create the context
export const ModalContext = createContext();

// Create a provider component
export const ModalProvider = ({ children }) => {
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  const openModal = () => {
    setIsAnyModalOpen(true);
    // Only prevent scrolling, don't affect visibility
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsAnyModalOpen(false);
    // Restore scrolling
    document.body.style.overflow = '';
  };

  return (
    <ModalContext.Provider value={{ isAnyModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook for easier usage
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}; 