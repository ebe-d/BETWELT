import { useState } from 'react';
import ChatBot from './chatbot';
import styles from './ChatBotWidget.module.css';

function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.chatBotWidgetContainer}>
      {isOpen && (
        <div className={styles.chatBotWrapper}>
          <ChatBot />
        </div>
      )}
      
      <button 
        className={`${styles.chatBotToggle} ${isOpen ? styles.active : ''}`}
        onClick={toggleChatBot}
        aria-label="Toggle chat assistant"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.botIcon}>
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M20 19v-2a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v2"></path>
            <line x1="12" y1="16" x2="12" y2="19"></line>
            <line x1="8" y1="16" x2="8" y2="19"></line>
            <line x1="16" y1="16" x2="16" y2="19"></line>
          </svg>
        )}
        {!isOpen && <span className={styles.botPulse}></span>}
      </button>
    </div>
  );
}

export default ChatBotWidget; 