import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Predixor 🤖, your AI betting assistant. How can I help you today?", sender: "bot" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      // Simulating API call delay for better UX
      setTimeout(async () => {
        try {
          // You can replace this with your actual API endpoint
          // const res = await axios.post('http://localhost:5000/api/chat', { message: userInput });
          // const botReply = { text: res.data.reply, sender: "bot" };
          
          // For demo purposes, we'll use canned responses
          const demoReplies = [
            "I can help you analyze your betting patterns and suggest strategies to improve your win rate.",
            "Based on recent trends, you might want to consider placing bets on the underdog in tomorrow's match.",
            "The odds for this weekend's games have just been updated. Would you like me to show you the best opportunities?",
            "I've analyzed your betting history and noticed you perform best with tennis matches. Would you like more insights?",
            "Feel free to ask me about betting strategies, odds comparison, or market analysis anytime!"
          ];
          const randomReply = demoReplies[Math.floor(Math.random() * demoReplies.length)];
          const botReply = { text: randomReply, sender: "bot" };
          
          setMessages(prev => [...prev, botReply]);
        } catch (error) {
          console.error(error);
          setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: "bot" }]);
        } finally {
          setIsTyping(false);
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: "Error! Try again later.", sender: "bot" }]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Predixor Assistant</h3>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chatbot-message ${msg.sender}`}>
            <div className="message-text">
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chatbot-message bot">
            <div className="message-text typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        <input
          type="text"
          className="chatbot-input"
          placeholder="Ask me anything..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="chatbot-send-button" onClick={handleSend}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
