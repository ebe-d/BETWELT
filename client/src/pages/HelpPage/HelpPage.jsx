import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp, FaTicketAlt, FaUsers, FaEnvelope, FaBook, FaGraduationCap, FaRobot, FaGavel, FaTwitter, FaInstagram, FaTelegram, FaDiscord, FaPhoneAlt, FaArrowLeft, FaArrowUp } from 'react-icons/fa';
import Navbar from '@/components/NavBar/navbar';
import styles from './helppage.module.css';

// Typing animation component
const TypingText = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, delay]);

  return <span>{displayText}</span>;
};

const HelpPage = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showAINotice, setShowAINotice] = useState(true);
  const [ticketStatus, setTicketStatus] = useState('open');
  const faqRefs = useRef({});
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState('faq');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    type: '',
    subject: '',
    description: ''
  });

  // Watch for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event.detail) {
        setTheme(event.detail.theme);
      } else {
        setTheme(localStorage.getItem('theme') || 'dark');
      }
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  // Hide AI Notice after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAINotice(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll monitoring for section highlighting and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide back to top button
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Determine active section based on scroll position
      const sections = ['faq', 'tickets', 'community', 'rules', 'tutorials', 'contact'];
      let currentSection = 'faq';
      
      for (const section of sections) {
        const element = sectionRefs.current[section];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) { // Adjust this value as needed
            currentSection = section;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to section
  const scrollToSection = (section) => {
    const element = sectionRefs.current[section];
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // FAQ Data
  const faqData = {
    general: [
      {
        question: "What is Predixor?",
        answer: "Predixor is a next-generation predictive betting platform where users can place predictions on various events, track their profits, and compete on leaderboards. We use PDX (Predixor Dollars) as our platform currency."
      },
      {
        question: "How do I get started?",
        answer: "To get started, simply create an account, verify your email, and make your first deposit. You can then explore available events and place your predictions."
      },
      {
        question: "What is PDX?",
        answer: "PDX (Predixor Dollars) is our platform's virtual currency. You can deposit real money to get PDX, place predictions, and withdraw your winnings back to your account."
      }
    ],
    betting: [
      {
        question: "How do I place a prediction?",
        answer: "Navigate to the Events page, select an event you're interested in, choose your prediction, enter the amount of PDX you want to bet, and confirm your prediction."
      },
      {
        question: "How are odds calculated?",
        answer: "Our odds are calculated based on various factors including historical data, current form, and market conditions. They are updated in real-time to reflect the latest information."
      },
      {
        question: "What happens if an event is cancelled?",
        answer: "If an event is cancelled, all predictions are voided and PDX is returned to users' wallets automatically."
      }
    ],
    wallet: [
      {
        question: "How do I deposit PDX?",
        answer: "Go to your Wallet page, click 'Deposit', choose your preferred payment method, enter the amount, and follow the payment instructions."
      },
      {
        question: "How long do withdrawals take?",
        answer: "Withdrawals typically process within 24-48 hours, depending on your chosen payment method and verification status."
      },
      {
        question: "What are the minimum deposit/withdrawal amounts?",
        answer: "Minimum deposit is 100 PDX, and minimum withdrawal is 500 PDX. These limits help ensure efficient processing and security."
      }
    ],
    security: [
      {
        question: "How is my account protected?",
        answer: "We use industry-standard encryption, two-factor authentication, and regular security audits to protect your account and transactions."
      },
      {
        question: "What should I do if I suspect unauthorized activity?",
        answer: "Immediately contact our support team and change your password. We'll help you secure your account and investigate any suspicious activity."
      },
      {
        question: "How do I enable two-factor authentication?",
        answer: "Go to your Account Settings, find the Security section, and follow the instructions to enable 2FA using your preferred method."
      }
    ]
  };

  // Handle FAQ category toggle
  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  // Handle ticket form submission
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    // Normally would send to backend here
    console.log('Ticket submitted:', ticketForm);
    setTicketStatus('submitted');
  };

  // Get category title with proper formatting
  const getCategoryTitle = (category) => {
    const titles = {
      general: 'General Questions',
      betting: 'Betting & Events',
      wallet: 'Wallet & Transactions',
      security: 'Account & Security'
    };
    return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <>
      <Navbar />
      <div className={styles.helpContainer} data-theme={theme}>
        {/* Help Navigation */}
        <div className={styles.helpNav}>
          <button 
            className={`${styles.navButton} ${activeSection === 'faq' ? styles.active : ''}`}
            onClick={() => scrollToSection('faq')}
          >
            <FaBook />
            FAQ
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'tickets' ? styles.active : ''}`}
            onClick={() => scrollToSection('tickets')}
          >
            <FaTicketAlt />
            Support Tickets
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'community' ? styles.active : ''}`}
            onClick={() => scrollToSection('community')}
          >
            <FaUsers />
            Community Forum
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'rules' ? styles.active : ''}`}
            onClick={() => scrollToSection('rules')}
          >
            <FaGavel />
            Betting Rules
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'tutorials' ? styles.active : ''}`}
            onClick={() => scrollToSection('tutorials')}
          >
            <FaGraduationCap />
            Tutorials
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'contact' ? styles.active : ''}`}
            onClick={() => scrollToSection('contact')}
          >
            <FaEnvelope />
            Contact Us
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.helpContent}>
          {/* FAQ Section */}
          <div 
            className={styles.faqSection} 
            ref={el => sectionRefs.current.faq = el}
            id="faq-section"
          >
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqCategories}>
              {Object.entries(faqData).map(([category, questions]) => (
                <div 
                  key={category} 
                  className={`${styles.faqCategory} ${activeCategory === category ? styles.active : ''}`}
                  ref={el => faqRefs.current[category] = el}
                >
                  <button 
                    className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {getCategoryTitle(category)}
                    {activeCategory === category ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <div className={styles.questionsList}>
                    {questions.map((item, index) => (
                      <div key={index} className={styles.questionItem}>
                        <h3>{item.question}</h3>
                        <p>{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Tickets Section */}
          <div 
            className={styles.ticketsSection} 
            ref={el => sectionRefs.current.tickets = el}
            id="tickets-section"
          >
            <h2>Support Tickets</h2>
            {ticketStatus === 'open' ? (
              <form onSubmit={handleTicketSubmit} className={styles.ticketForm}>
                <div className={styles.formGroup}>
                  <label>Issue Type</label>
                  <select 
                    value={ticketForm.type}
                    onChange={(e) => setTicketForm({...ticketForm, type: e.target.value})}
                    required
                  >
                    <option value="">Select an issue type</option>
                    <option value="account">Account Issues</option>
                    <option value="betting">Betting Disputes</option>
                    <option value="wallet">Wallet Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Subject</label>
                  <input 
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    placeholder="Please provide detailed information about your issue"
                    required
                  />
                </div>
                <button type="submit" className={styles.submitButton}>
                  Submit Ticket
                </button>
              </form>
            ) : (
              <div className={styles.ticketSubmitted}>
                <h3>Ticket Submitted Successfully!</h3>
                <p>Your ticket ID is <strong>#{Math.floor(10000 + Math.random() * 90000)}</strong></p>
                <p>We'll get back to you as soon as possible.</p>
                <button onClick={() => setTicketStatus('open')}>
                  Submit Another Ticket
                </button>
              </div>
            )}
          </div>

          {/* Community Forum Section */}
          <div 
            className={styles.communitySection} 
            ref={el => sectionRefs.current.community = el}
            id="community-section"
          >
            <h2>Community Forum</h2>
            <div className={styles.forumCategories}>
              <div className={styles.forumCategory}>
                <h3>Bug Reports</h3>
                <p>Report issues and help improve the platform. Our team actively monitors these reports to provide a better experience for everyone.</p>
                <button>Report Bug</button>
              </div>
              <div className={styles.forumCategory}>
                <h3>Feature Requests</h3>
                <p>Suggest new features and improvements. Have a great idea that would make Predixor even better? We'd love to hear about it!</p>
                <button>Request Feature</button>
              </div>
            </div>
          </div>

          {/* Betting Rules & Fair Play Policy Section */}
          <div 
            className={styles.rulesSection} 
            ref={el => sectionRefs.current.rules = el}
            id="rules-section"
          >
            <h2>Betting Rules & Fair Play Policy</h2>
            <div className={styles.rulesContent}>
              <section className={styles.ruleSection}>
                <h3>How Bets Work</h3>
                <ul>
                  <li>Bets are placed using PDX (Predixor Dollars)</li>
                  <li>Each event has specific betting options and odds</li>
                  <li>Odds are calculated based on real-time data and market conditions</li>
                  <li>Bets can be placed until the event starts</li>
                  <li>Winnings are automatically credited to your wallet after event completion</li>
                </ul>
              </section>

              <section className={styles.ruleSection}>
                <h3>Responsible Betting Guidelines</h3>
                <ul>
                  <li>Set personal betting limits and stick to them</li>
                  <li>Never bet more than you can afford to lose</li>
                  <li>Take regular breaks from betting</li>
                  <li>Don't chase losses</li>
                  <li>Keep track of your betting history</li>
                  <li>Seek help if you feel you're developing a gambling problem</li>
                </ul>
              </section>

              <section className={styles.ruleSection}>
                <h3>Fair Play Policy</h3>
                <ul>
                  <li>No manipulation of odds or event outcomes</li>
                  <li>No use of automated betting systems</li>
                  <li>No multiple accounts or identity fraud</li>
                  <li>No sharing of account credentials</li>
                  <li>No exploitation of system vulnerabilities</li>
                  <li>Respect for other users and community guidelines</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Tutorials & Guides Section */}
          <div 
            className={styles.tutorialsSection} 
            ref={el => sectionRefs.current.tutorials = el}
            id="tutorials-section"
          >
            <h2>Tutorials & Guides</h2>
            <div className={styles.tutorialsGrid}>
              <div className={styles.tutorialCard}>
                <h3>How to Place Bets</h3>
                <ol>
                  <li>Navigate to the Events page</li>
                  <li>Select an event you're interested in</li>
                  <li>Choose your prediction</li>
                  <li>Enter the amount of PDX to bet</li>
                  <li>Review your bet details</li>
                  <li>Confirm your prediction</li>
                </ol>
              </div>

              <div className={styles.tutorialCard}>
                <h3>Managing Your Wallet</h3>
                <ol>
                  <li>Go to your Wallet page</li>
                  <li>Click "Deposit" to add PDX</li>
                  <li>Choose your payment method</li>
                  <li>Enter the amount to deposit</li>
                  <li>Follow payment instructions</li>
                  <li>For withdrawals, click "Withdraw" and follow similar steps</li>
                </ol>
              </div>

              <div className={styles.tutorialCard}>
                <h3>Understanding Betting Odds</h3>
                <ul>
                  <li>Decimal odds show your total return (stake + profit)</li>
                  <li>Higher odds mean higher risk but higher potential return</li>
                  <li>Lower odds indicate higher probability of winning</li>
                  <li>Odds are updated based on betting volume and market conditions</li>
                  <li>Always check odds before placing your bet</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Us Section */}
          <div 
            className={styles.contactSection} 
            ref={el => sectionRefs.current.contact = el}
            id="contact-section"
          >
            <h2>Contact Us</h2>
            <div className={styles.contactInfo}>
              <div className={styles.contactMethod}>
                <h3>Email Support</h3>
                <p>ebenezerdsouza27@gmail.com</p>
                <p>Our support team typically responds within 24 hours.</p>
              </div>
              <div className={styles.socialLinks}>
                <h3>Connect With Us</h3>
                <div className={styles.socialIcons}>
                  <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /> X</a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><FaTelegram /> Telegram</a>
                  <a href="#" target="_blank" rel="noopener noreferrer"><FaDiscord /> Discord</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chatbot Notice */}
        <div className={`${styles.aiNotice} ${!showAINotice ? styles.hide : ''}`}>
          <div className={styles.aiNoticeIconContainer}>
            <FaRobot />
          </div>
          {showAINotice && (
            <TypingText text="Need help? Click the AI bot icon in the bottom left corner to chat!" />
          )}
        </div>

        {/* Back to Top Button */}
        <button 
          className={`${styles.backToTopButton} ${showBackToTop ? styles.show : ''}`} 
          onClick={scrollToTop}
        >
          <FaArrowUp />
        </button>
      </div>
    </>
  );
};

export default HelpPage; 