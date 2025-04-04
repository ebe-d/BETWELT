import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTemperatureHigh, 
  FaUsers, FaUserTie, FaTv, FaInfoCircle, FaChartLine, FaTag, FaGlobe, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import styles from './eventdetail.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../../context/UserContext';

const API_URL = 'http://localhost:5000/api/events';

// Statistics component for professional graphs
const StatChart = ({ stat, teamAName, teamBName }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const statTotal = stat.a + stat.b;
  const percentA = (stat.a / statTotal) * 100;
  const percentB = (stat.b / statTotal) * 100;
  
  return (
    <div className={styles.statChart}>
      <div className={styles.statName}>{stat.name}</div>
      <div className={styles.chartContainer}>
        <div className={styles.teamLabels}>
          <span className={styles.teamALabel}>{teamAName}</span>
          <span className={styles.teamBLabel}>{teamBName}</span>
        </div>
        <div className={styles.barComparisonChart}>
          <div className={styles.barChartValues}>
            <span className={styles.valueA}>{stat.a}</span>
            <span className={styles.valueB}>{stat.b}</span>
          </div>
          <div className={styles.barContainer}>
            <div className={styles.barA} style={{ width: animated ? `${percentA}%` : '0%' }}>
              {percentA > 15 && <span className={styles.barLabel}>{Math.round(percentA)}%</span>}
            </div>
            <div className={styles.barB} style={{ width: animated ? `${percentB}%` : '0%' }}>
              {percentB > 15 && <span className={styles.barLabel}>{Math.round(percentB)}%</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Betting Modal Component
const BettingModal = ({ isOpen, onClose, eventData, onPlaceBet }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [estimatedPayout, setEstimatedPayout] = useState(0);
  const { userData } = useUser();
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const calculatePayout = (amount, odds) => {
    if (!amount || !odds) return 0;
    return (parseFloat(amount) * parseFloat(odds)).toFixed(2);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (betAmount) {
      setEstimatedPayout(calculatePayout(betAmount, option.odds));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setBetAmount(value);
    if (selectedOption) {
      setEstimatedPayout(calculatePayout(value, selectedOption.odds));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption || !betAmount) {
      toast.error('Please select an option and enter a bet amount');
      return;
    }

    if (parseFloat(betAmount) > userData.walletBalance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await onPlaceBet({
        eventId: eventData._id,
        selection: selectedOption.name,
        odds: selectedOption.odds,
        amount: parseFloat(betAmount),
        potentialPayout: estimatedPayout
      });
      toast.success('Bet placed successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to place bet. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.bettingModal} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2>Place Your Prediction</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.eventInfo}>
            <h3>{eventData.title}</h3>
            <p className={styles.eventDate}>{new Date(eventData.date).toLocaleDateString()}</p>
          </div>

          <div className={styles.balanceInfo}>
            <span>Available Balance:</span>
            <span className={styles.balanceAmount}>{userData.walletBalance} PDX</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.bettingForm}>
            <div className={styles.optionsGrid}>
              {eventData.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.optionCard} ${selectedOption?.name === option.name ? styles.selected : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className={styles.optionName}>{option.name}</div>
                  <div className={styles.optionOdds}>{option.odds}</div>
                </div>
              ))}
            </div>

            <div className={styles.betAmountSection}>
              <label htmlFor="betAmount">Bet Amount (PDX)</label>
              <div className={styles.amountInput}>
                <input
                  type="number"
                  id="betAmount"
                  value={betAmount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  min="1"
                  max={userData.walletBalance}
                />
                <div className={styles.quickAmounts}>
                  {[10, 50, 100, 500].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={styles.quickAmountButton}
                      onClick={() => {
                        setBetAmount(amount.toString());
                        if (selectedOption) {
                          setEstimatedPayout(calculatePayout(amount, selectedOption.odds));
                        }
                      }}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.payoutInfo}>
              <div className={styles.payoutRow}>
                <span>Potential Payout:</span>
                <span className={styles.payoutAmount}>{estimatedPayout} PDX</span>
              </div>
            </div>

            <button
              type="submit"
              className={styles.placeBetButton}
              disabled={!selectedOption || !betAmount}
            >
              Place Prediction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const EventDetail = () => {
  // Location for key generation (force remount on navigation)
  const location = useLocation();

  // State for event data
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for theme
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // Tab state for event details
  const [activeTab, setActiveTab] = useState('description');
  
  // State to trigger animations
  const [animationsActive, setAnimationsActive] = useState(false);
  
  // Betting modal state
  const [isBettingModalOpen, setIsBettingModalOpen] = useState(false);
  const [userBets, setUserBets] = useState([]);
  
  // Navigation
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        
        // Transform API data to match component's expected format
        const apiEvent = response.data;
        
        // Get participant data from either options or teams field
        const option1 = apiEvent.options?.option1 || apiEvent.teams?.home || { name: '', logo: '' };
        const option2 = apiEvent.options?.option2 || apiEvent.teams?.away || { name: '', logo: '' };
        
        // Get odds data from either new field names or old ones
        const odds = {
          a: apiEvent.odds?.option1 || apiEvent.odds?.home || 1.0,
          draw: apiEvent.odds?.draw || 0,
          b: apiEvent.odds?.option2 || apiEvent.odds?.away || 1.0
        };
        
        // Format the event data to match the component's expectations
        const formattedEvent = {
          id: apiEvent._id,
          title: apiEvent.title,
          name: apiEvent.match,
          category: apiEvent.category,
          subcategory: '',
          date: new Date(apiEvent.date).toLocaleDateString(),
          time: apiEvent.time,
          location: apiEvent.venue,
          status: apiEvent.status,
          description: apiEvent.description || 'No description available.',
          image: apiEvent.image,
          participants: {
            a: {
              name: option1.name,
              shortName: option1.logo,
              details: '',
              image: null
            },
            b: {
              name: option2.name,
              shortName: option2.logo,
              details: '',
              image: null
            }
          },
          additionalInfo: [
            { label: 'Venue', value: apiEvent.venue, icon: 'users' },
            { label: 'Category', value: apiEvent.category, icon: 'tv' }
          ],
          odds: odds,
          // Add history and statistics if they exist in the API response
          history: apiEvent.history ? apiEvent.history.map(item => ({
            date: new Date(item.date).toLocaleDateString(),
            context: item.competition || 'Previous Match',
            result: item.result
          })) : [],
          statistics: apiEvent.statistics ? apiEvent.statistics.map(stat => ({
            name: stat.name,
            a: stat.home || stat.option1,
            b: stat.away || stat.option2
          })) : []
        };
        
        setEventData(formattedEvent);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error('Failed to load event details');
        setError('Failed to load event details');
        setLoading(false);
      }
    };
    
    // Only fetch if we have an ID
    if (id) {
      fetchEventData();
    }
  }, [id]);

  // Trigger animations after component mount
  useEffect(() => {
    setTimeout(() => {
      setAnimationsActive(true);
    }, 10);
  }, []);

  // Handle place bet click
  const handlePlaceBet = (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsBettingModalOpen(true); // Open the betting modal
  };

  // Handle bet confirmation
  const handleBetConfirmation = (betData) => {
    // In a real app, this would call an API to save the bet
    console.log('Bet placed:', betData);
    
    // Add to user bets for this session
    setUserBets([...userBets, betData]);
    
    // Close modal
    setIsBettingModalOpen(false);
  };

  // Function to render the appropriate icon based on icon type
  const renderIcon = (iconType) => {
    switch(iconType) {
      case 'users':
        return <FaUsers />;
      case 'weather':
        return <FaTemperatureHigh />;
      case 'referee':
        return <FaUserTie />;
      case 'tv':
        return <FaTv />;
      default:
        return <FaInfoCircle />;
    }
  };

  // Show loading state if data is being fetched
  if (loading) {
    return (
      <div className={styles.loadingContainer} data-theme={theme}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  // Show error message if there was an error fetching the data
  if (error) {
    return (
      <div className={styles.errorContainer} data-theme={theme}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/home/events" className={styles.backButton}>
          <FaArrowLeft />
          Back to Events
        </Link>
      </div>
    );
  }

  // If event data is not available yet, return null
  if (!eventData) {
    return null;
  }

  // Determine if the event is a versus-type event
  const isVersusEvent = eventData.participants && eventData.participants.a && eventData.participants.b;

  return (
    <div 
      key={`event-detail-${location.key}`} 
      className={`${styles.eventDetailContainer} ${animationsActive ? styles.animationsActive : ''}`} 
      data-theme={theme}
    >
      <div className={styles.eventDetailContent}>
        {/* Back Button */}
        <Link to="/home/events" className={styles.backButton}>
          <FaArrowLeft />
          Back to Events
        </Link>

        {/* Event Header */}
        <div className={styles.eventHeader}>
          <div className={styles.eventCategories}>
            <span className={styles.eventBadge}>{eventData.category}</span>
            {eventData.subcategory && 
              <span className={styles.eventSubBadge}>{eventData.subcategory}</span>
            }
          </div>
          <h1 className={styles.eventTitle}>{eventData.name}</h1>
          <div className={styles.eventMeta}>
            <div className={styles.metaItem}>
              <FaCalendarAlt />
              {eventData.date}
            </div>
            <div className={styles.metaItem}>
              <FaClock />
              {eventData.time}
            </div>
            {eventData.location && (
              <div className={styles.metaItem}>
                <FaMapMarkerAlt />
                {eventData.location}
              </div>
            )}
            <div className={styles.metaItem}>
              <FaTag />
              {eventData.status}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.eventContentFull}>
          {/* Event Details */}
          <div className={styles.eventDetails}>
            {/* Event Hero Image */}
            <div className={styles.eventHero}>
              <img src={eventData.image} alt={eventData.name} className={styles.eventImage} />
            </div>

            {/* Participants Section - Conditionally rendered based on event type */}
            {isVersusEvent ? (
              <div className={styles.teamVsContainer}>
                <div className={styles.teamVs}>
                  <div className={styles.teamCard}>
                    <div className={styles.teamLogo}>
                      {eventData.participants.a.image ? 
                        <img src={eventData.participants.a.image} alt={eventData.participants.a.name} /> : 
                        eventData.participants.a.shortName
                      }
                    </div>
                    <div className={styles.teamName}>{eventData.participants.a.name}</div>
                    {eventData.participants.a.details && (
                      <div className={styles.teamForm}>{eventData.participants.a.details}</div>
                    )}
                  </div>

                  <div className={styles.versusSection}>VS</div>

                  <div className={styles.teamCard}>
                    <div className={styles.teamLogo}>
                      {eventData.participants.b.image ? 
                        <img src={eventData.participants.b.image} alt={eventData.participants.b.name} /> : 
                        eventData.participants.b.shortName
                      }
                    </div>
                    <div className={styles.teamName}>{eventData.participants.b.name}</div>
                    {eventData.participants.b.details && (
                      <div className={styles.teamForm}>{eventData.participants.b.details}</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.singleEventContainer}>
                {/* For non-versus events like elections, market predictions, etc. */}
                <div className={styles.eventMainInfo}>
                  <h3 className={styles.eventMainTitle}>{eventData.title}</h3>
                  {eventData.participants && Object.keys(eventData.participants).length > 0 && (
                    <div className={styles.participantsList}>
                      {Object.values(eventData.participants).map((participant, index) => (
                        <div key={index} className={styles.participantItem}>
                          {participant.image && (
                            <div className={styles.participantImage}>
                              <img src={participant.image} alt={participant.name} />
                            </div>
                          )}
                          <div className={styles.participantName}>{participant.name}</div>
                          {participant.details && (
                            <div className={styles.participantDetails}>{participant.details}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info Section */}
            {eventData.additionalInfo && eventData.additionalInfo.length > 0 && (
              <div className={styles.eventInfo}>
                {eventData.additionalInfo.map((info, index) => (
                  <div key={index} className={styles.infoRow}>
                    <div className={styles.infoLabel}>
                      {renderIcon(info.icon)}
                      {info.label}
                    </div>
                    <div className={styles.infoValue}>{info.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.eventActions}>
              <button 
                className={styles.placeBetButton}
                onClick={handlePlaceBet}
                type="button" // Add type="button" to prevent form submission
              >
                Place Prediction
              </button>
              <button 
                className={`${styles.actionButton} ${styles.secondaryButton}`}
                onClick={() => navigate('/home/events')}
              >
                Back to Events
              </button>
            </div>

            {/* Add user bets section if they have placed any bets */}
            {userBets.length > 0 && (
              <div className={styles.userBetsSection}>
                <h3>Your Predictions</h3>
                <div className={styles.betsList}>
                  {userBets.map((bet, index) => (
                    <div key={index} className={styles.betCard}>
                      <div className={styles.betInfo}>
                        <div className={styles.betSelection}>
                          <strong>Selection:</strong> {bet.selectionName}
                        </div>
                        <div className={styles.betDetails}>
                          <span><strong>Amount:</strong> {bet.amount} PDX</span>
                          <span><strong>Odds:</strong> {bet.odds}</span>
                        </div>
                      </div>
                      <div className={styles.betPayout}>
                        <div className={styles.payoutLabel}>Potential Payout:</div>
                        <div className={styles.payoutValue}>{bet.potentialPayout} PDX</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Tabs - Dynamically determine which tabs to show based on data availability */}
            <div className={styles.eventTabs}>
              <div 
                className={`${styles.eventTab} ${activeTab === 'description' ? styles.active : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </div>
              {eventData.history && eventData.history.length > 0 && (
                <div 
                  className={`${styles.eventTab} ${activeTab === 'history' ? styles.active : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  {isVersusEvent ? 'Head to Head' : 'History'}
                </div>
              )}
              {eventData.statistics && eventData.statistics.length > 0 && (
                <div 
                  className={`${styles.eventTab} ${activeTab === 'stats' ? styles.active : ''}`}
                  onClick={() => setActiveTab('stats')}
                >
                  Statistics
                </div>
              )}
            </div>

            {/* Event Tabs Content */}
            <div className={styles.tabsContent}>
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className={styles.eventDescription}>
                  <h3>Event Description</h3>
                  <p>{eventData.description}</p>
                </div>
              )}
              
              {/* Head to Head Tab */}
              {activeTab === 'history' && eventData.history && (
                <div className={styles.h2hSection}>
                  <h3>Head to Head Results</h3>
                  <div className={styles.h2hList}>
                    {eventData.history.map((match, index) => (
                      <div key={index} className={styles.h2hItem}>
                        <div className={styles.h2hDate}>{match.date}</div>
                        <div className={styles.h2hCompetition}>{match.context}</div>
                        <div className={styles.h2hResult}>{match.result}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Statistics Tab */}
              {activeTab === 'stats' && eventData.statistics && (
                <div className={styles.statsSection}>
                  <h3>Comparative Statistics</h3>
                  <div className={styles.statsGrid}>
                    {eventData.statistics.map((stat, index) => (
                      <StatChart 
                        key={index} 
                        stat={stat} 
                        teamAName={eventData.participants.a.name} 
                        teamBName={eventData.participants.b.name} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Betting Modal */}
      <BettingModal 
        isOpen={isBettingModalOpen}
        onClose={() => setIsBettingModalOpen(false)}
        eventData={eventData}
        onPlaceBet={handleBetConfirmation}
      />
    </div>
  );
};

export default EventDetail; 