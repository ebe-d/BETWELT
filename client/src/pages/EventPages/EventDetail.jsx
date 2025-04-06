import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './eventdetail.module.css';
import { toast } from 'react-toastify';
import { useModal } from '../../context/ModalContext';
import DirectPredictionModal from '@/components/DirectPredictionModal/DirectPredictionModal';
import Navbar from "@/components/NavBar/navbar";
import axios from 'axios';

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Simplified state
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [userPrediction, setUserPrediction] = useState(null);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [userId, setUserId] = useState('user123'); // Temporary user ID for testing
  const { isAnyModalOpen } = useModal();

  // Watch for theme changes - simplified
  useEffect(() => {
    const handleThemeChange = () => setTheme(localStorage.getItem('theme') || 'dark');
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  // API URL for events
  const API_URL = 'http://localhost:5000/api/events';

  // Fetch event data from the backend API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching event with ID:", id);
        
        if (!id) {
          throw new Error('Event ID is missing');
        }
        
        // Fetch the event data from the backend API
        const response = await axios.get(`${API_URL}/${id}`);
        const eventData = response.data;
        
        console.log("✅ Fetched event data:", eventData);
        
        // Format the event data for display
        const formattedEvent = formatEventData(eventData);
        setEventData(formattedEvent);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError('Failed to load event data. Please try again.');
        setLoading(false);
        toast.error('Failed to load event data');
      }
    };

    fetchEventData();
  }, [id]);
  
  // Format event data for display
  const formatEventData = (event) => {
    // Support both old and new field structures
    const option1 = event.options?.option1 || event.teams?.home || {};
    const option2 = event.options?.option2 || event.teams?.away || {};
    
    // Format the event data
    return {
      ...event,
      id: event._id || event.id,
      title: event.title || '',
      name: event.match || '',
      category: event.category || '',
      subcategory: '',
      date: event.date || '',
      time: event.time || '',
      venue: event.venue || '',
      location: event.venue || '',
      status: event.status || 'upcoming',
      description: event.description || '',
      image: event.image || 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      teams: {
        home: { 
          name: option1.name || '', 
          logo: option1.logo || ''
        },
        away: { 
          name: option2.name || '', 
          logo: option2.logo || ''
        }
      },
      options: {
        option1: {
          name: option1.name || '',
          logo: option1.logo || ''
        },
        option2: {
          name: option2.name || '',
          logo: option2.logo || ''
        }
      },
      odds: {
        yes: event.odds?.option1 || event.odds?.home || 2.0,
        no: event.odds?.option2 || event.odds?.away || 1.8,
        draw: event.odds?.draw || null
      },
      // Default AI analysis if not available
      aiAnalysis: {
        winProbability: 50,
        keyFactors: [
          "Historical data analysis",
          "Current form and statistics",
          "Venue and conditions"
        ],
        prediction: "Analysis not available for this event.",
        confidence: 50,
        trend: "steady"
      }
    };
  };

  // Handle opening prediction modal
  const handleMakePrediction = (e) => {
    e.preventDefault();
    setIsPredictionModalOpen(true);
  };

  // Check if user has already predicted on this event
  useEffect(() => {
    const checkUserPrediction = async () => {
      if (!id || !userId) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/api/predictions/check/${id}/${userId}`);
        const { hasPredicted, prediction } = response.data;
        
        setHasPredicted(hasPredicted);
        if (hasPredicted) {
          setUserPrediction(prediction);
        }
      } catch (err) {
        console.error('Error checking user prediction:', err);
      }
    };
    
    checkUserPrediction();
  }, [id, userId]);

  // Handle prediction confirmation
  const handlePredictionConfirmation = async (predictionData) => {
    try {
      // Save prediction to database
      const response = await axios.post('http://localhost:5000/api/predictions', {
        eventId: id,
        userId: userId,
        option: predictionData.option,
        amount: predictionData.amount,
        odds: predictionData.odds
      });
      
      // Update local state
      setUserPrediction(response.data);
      setHasPredicted(true);
      
      toast.success('Prediction placed successfully!');
      setIsPredictionModalOpen(false);
    } catch (error) {
      console.error('Error saving prediction:', error);
      toast.error('Failed to place prediction. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Show loading state if data is being fetched
  if (loading) {
    return (
      <div className="event-detail-page">
        <Navbar imglink={"https://raw.githubusercontent.com/eseku/betwelts/main/Public/images/logo.png"} />
        <div className={styles.loadingContainer} data-theme={theme}>
          <div className={styles.spinner}></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  // Show error message if there was an error fetching the data
  if (error) {
    return (
      <div className="event-detail-page">
        <Navbar imglink={"https://raw.githubusercontent.com/eseku/betwelts/main/Public/images/logo.png"} />
        <div className={styles.errorContainer} data-theme={theme}>
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/home/events" className={styles.backButton}>
            <FaArrowLeft />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // If event data is not available yet, return null
  if (!eventData) {
    return null;
  }

  // Determine if the event is a versus-type event
  const isVersusEvent = eventData.teams && eventData.teams.home && eventData.teams.away;

  return (
    <div className="event-detail-page">
      <Navbar imglink={"https://raw.githubusercontent.com/eseku/betwelts/main/Public/images/logo.png"} />
      <div 
        className={styles.eventDetailContainer}
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
            <div className={styles.eventImage}>
              <img src={eventData.image} alt={eventData.title} />
              <div className={styles.eventCategory}>{eventData.category}</div>
              <div className={`${styles.eventStatus} ${styles[eventData.status]}`}>
                {eventData.status.charAt(0).toUpperCase() + eventData.status.slice(1)}
              </div>
            </div>
            
            <div className={styles.eventHeaderContent}>
              <h1 className={styles.eventTitle}>{eventData.title}</h1>
              
              {/* Quick Prediction Button below title */}
              {eventData.status !== 'completed' && (
                <button
                  className={`${styles.makePredictionButton} ${styles.quickPredictionButton}`}
                  onClick={handleMakePrediction}
                  disabled={eventData.status === 'completed'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 12C17.5 9.1 15.9 6.6 13.5 5.5C13.8 5 14 4.5 14 4C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4C10 4.5 10.2 5 10.5 5.5C8.1 6.6 6.5 9.1 6.5 12C6.5 12.3 6.5 12.7 6.6 13H17.4C17.5 12.7 17.5 12.3 17.5 12Z" fill="white"/>
                    <path d="M19 14H5C5 14 5 14.2 5 14.5C5 17.5 7.5 20 10.5 20H13.5C16.5 20 19 17.5 19 14.5C19 14.2 19 14 19 14Z" fill="white"/>
                    <path d="M11.5 22H12.5C13.1 22 13.5 21.6 13.5 21V20H10.5V21C10.5 21.6 10.9 22 11.5 22Z" fill="white"/>
                  </svg>
                  Make Prediction
                </button>
              )}
              
              <div className={styles.eventMetaInfo}>
                <div className={styles.metaItem}>
                  <FaCalendarAlt />
                  <span>{formatDate(eventData.date)}</span>
                </div>
                <div className={styles.metaItem}>
                  <FaClock />
                  <span>{eventData.time}</span>
                </div>
                <div className={styles.metaItem}>
                  <FaMapMarkerAlt />
                  <span>{eventData.venue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.eventMainContent}>
            {/* Event Description */}
            <div className={styles.eventDescription}>
              <h2>Event Description</h2>
              <p>{eventData.description}</p>
              
              <div className={styles.predictionQuestion}>
                <h3>Prediction Question</h3>
                <p>{eventData.name}</p>
              </div>
            </div>
            
            {/* AI Analysis Section - Moved after event description */}
            {eventData.aiAnalysis && (
              <div className={styles.aiAnalysisSection}>
                <h2>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.aiIcon}>
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
                  </svg>
                  AI Analysis
                </h2>
                
                <div className={styles.aiInsightsContainer}>
                  {/* Confidence/Probability Gauge */}
                  <div className={styles.aiProbabilityGauge}>
                    <div className={styles.gaugeTitle}>
                      {eventData.category === 'Soccer' ? 'Win Probability' : 
                       eventData.category === 'Weather' && eventData.subcategory === 'Precipitation' ? 'Rain Probability' :
                       eventData.category === 'Weather' && eventData.subcategory === 'Temperature' ? 'Heat Probability' : 
                       'Probability'}
                    </div>
                    <div className={styles.gaugeChart}>
                      <div className={styles.gaugeBackground}></div>
                      <div 
                        className={styles.gaugeFill} 
                        style={{ 
                          width: `${eventData.aiAnalysis.winProbability || 
                                   eventData.aiAnalysis.rainProbability || 
                                   eventData.aiAnalysis.heatProbability || 50}%` 
                        }}
                      ></div>
                      <div className={styles.gaugeValue}>
                        {eventData.aiAnalysis.winProbability || 
                         eventData.aiAnalysis.rainProbability || 
                         eventData.aiAnalysis.heatProbability || 50}%
                      </div>
                    </div>
                    <div className={styles.confidenceLabel}>
                      AI Confidence: <span>{eventData.aiAnalysis.confidence}%</span>
                      <div className={`${styles.trendIndicator} ${styles[eventData.aiAnalysis.trend]}`}>
                        {eventData.aiAnalysis.trend === 'upward' ? '↑' : 
                         eventData.aiAnalysis.trend === 'downward' ? '↓' : '→'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Factors */}
                  <div className={styles.aiKeyFactors}>
                    <h3>Key Factors</h3>
                    <ul>
                      {eventData.aiAnalysis.keyFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* AI Prediction */}
                  <div className={styles.aiPrediction}>
                    <h3>AI Prediction</h3>
                    <p>{eventData.aiAnalysis.prediction}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Teams Section (if applicable) */}
            {isVersusEvent && (
              <div className={styles.teamsSection}>
                <h2>Teams</h2>
                <div className={styles.teamsContainer}>
                  <div className={styles.team}>
                    <div className={styles.teamLogo}>{eventData.teams.home.logo}</div>
                    <div className={styles.teamName}>{eventData.teams.home.name}</div>
                  </div>
                  <div className={styles.versusContainer}>VS</div>
                  <div className={styles.team}>
                    <div className={styles.teamLogo}>{eventData.teams.away.logo}</div>
                    <div className={styles.teamName}>{eventData.teams.away.name}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Odds Section */}
            <div className={styles.oddsSection}>
              <h2>Prediction Odds</h2>
              <div className={styles.oddsContainer}>
                <div className={styles.oddsItem}>
                  <div className={styles.oddsLabel}>Yes</div>
                  <div className={styles.oddsValue}>{eventData.odds.yes}</div>
                </div>
                <div className={styles.oddsItem}>
                  <div className={styles.oddsLabel}>No</div>
                  <div className={styles.oddsValue}>{eventData.odds.no}</div>
                </div>
              </div>
            </div>
            
            {/* User Prediction Section */}
            <div className={styles.userPredictionSection}>
              {hasPredicted && userPrediction ? (
                <>
                  <h2>Your Prediction</h2>
                  <div className={styles.userPredictionDetails}>
                    <div className={styles.predictionDetail}>
                      <span className={styles.detailLabel}>Option:</span>
                      <span className={styles.detailValue}>
                        {userPrediction.option === 'yes' ? 'Yes' : userPrediction.option === 'no' ? 'No' : 'Draw'}
                      </span>
                    </div>
                    <div className={styles.predictionDetail}>
                      <span className={styles.detailLabel}>Amount:</span>
                      <span className={styles.detailValue}>${userPrediction.amount.toFixed(2)}</span>
                    </div>
                    <div className={styles.predictionDetail}>
                      <span className={styles.detailLabel}>Odds:</span>
                      <span className={styles.detailValue}>{userPrediction.odds}</span>
                    </div>
                    <div className={styles.predictionDetail}>
                      <span className={styles.detailLabel}>Potential Winnings:</span>
                      <span className={styles.detailValue}>${userPrediction.potentialWinnings.toFixed(2)}</span>
                    </div>
                    <div className={styles.predictionDetail}>
                      <span className={styles.detailLabel}>Status:</span>
                      <span className={`${styles.detailValue} ${styles.status} ${styles[userPrediction.status]}`}>
                        {userPrediction.status.charAt(0).toUpperCase() + userPrediction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.makePredictionContainer}>
                  <h2>Make Your Prediction</h2>
                  <p>Predict the outcome of this event and win rewards!</p>
                  <button 
                    className={styles.makePredictionButton}
                    onClick={handleMakePrediction}
                    disabled={eventData.status === 'completed'}
                  >
                    Make Prediction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Prediction Modal */}
      {isPredictionModalOpen && (
        <DirectPredictionModal
          isOpen={isPredictionModalOpen}
          onClose={() => setIsPredictionModalOpen(false)}
          event={eventData}
          onConfirm={handlePredictionConfirmation}
        />
      )}
    </div>
  );
};

export default EventDetail; 