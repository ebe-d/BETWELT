import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from "@/components/NavBar/navbar";
import styles from './eventpages.module.css';
import Footer from '@/components/Footer/footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import DirectPredictionModal from '@/components/DirectPredictionModal/DirectPredictionModal';

const API_URL = 'http://localhost:5000/api/events';
const CATEGORIES_API_URL = 'http://localhost:5000/api/categories';

function EventPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [activeTab, setActiveTab] = useState('ongoing');
    const [activeSportFilter, setActiveSportFilter] = useState('all');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleEventCount, setVisibleEventCount] = useState(6);
    const [animationsActive, setAnimationsActive] = useState(false);
    const carouselRef = useRef(null);
    const carouselInterval = useRef(null);
    const [loading, setLoading] = useState(true);
    
    // State for API data
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [allEvents, setAllEvents] = useState({
        ongoing: [],
        upcoming: [],
        past: []
    });
    
    // State for filtered events
    const [filteredEvents, setFilteredEvents] = useState([]);
    
    // State for categories from the database
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Add state for prediction modal
    const [isPredictionModalOpen, setPredictionModalOpen] = useState(false);
    const [selectedEventForPrediction, setSelectedEventForPrediction] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await axios.get(CATEGORIES_API_URL);
                // Extract category data from the response
                const categoryData = response.data.map(category => category.name);
                setCategories(categoryData);
                setLoadingCategories(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
                setLoadingCategories(false);
            }
        };
        
        fetchCategories();
    }, []);

    // Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(API_URL);
                const events = response.data;
                
                // Format events data
                const formattedEvents = formatAPIEvents(events);
                
                // Set featured events
                const featured = formattedEvents.filter(event => event.featured);
                setFeaturedEvents(featured);
                
                // Categorize events by status exactly as they are in the database
                // Your database uses 'upcoming', 'live', and 'completed'
                const ongoing = formattedEvents.filter(event => event.status === 'live' || event.status === 'upcoming'); // Show both live and upcoming in "ongoing" tab for now
                const upcoming = formattedEvents.filter(event => event.status === 'upcoming');
                const past = formattedEvents.filter(event => event.status === 'completed');
                
                console.log('Event counts:', {
                    total: formattedEvents.length,
                    ongoing: ongoing.length,
                    upcoming: upcoming.length,
                    past: past.length,
                    featured: featured.length
                });
                
                setAllEvents({
                    ongoing,
                    upcoming,
                    past
                });
                
                // Initialize filtered events based on active tab
                setFilteredEvents(ongoing);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                toast.error('Failed to load events');
                setLoading(false);
            }
        };
        
        fetchEvents();
    }, []);

    // Format API events for display
    const formatAPIEvents = (events) => {
        return events.map(event => {
            // Support both old and new field structures
            const option1 = event.options?.option1 || event.teams?.home || {};
            const option2 = event.options?.option2 || event.teams?.away || {};
            
            // Ensure ID is a string and available
            const eventId = event.id ? String(event.id) : String(event._id || Math.random().toString(36).substring(2, 15));
            
            // Create a standardized event object that works with both admin and user side
            const formattedEvent = {
                ...event,
                id: eventId, // Ensure ID is consistently available and a string
                formattedDate: formatDate(event.date),
                countdown: getCountdown(event.date, event.time),
                // Ensure options structure is consistent
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
                // Ensure odds structure is consistent
                odds: {
                    option1: event.odds?.option1 || event.odds?.home || 1.0,
                    draw: event.odds?.draw || 0,
                    option2: event.odds?.option2 || event.odds?.away || 1.0
                },
                // For backward compatibility
                teams: {
                    home: {
                        name: option1.name || '',
                        logo: option1.logo || ''
                    },
                    away: {
                        name: option2.name || '',
                        logo: option2.logo || ''
                    }
                }
            };
            
            return formattedEvent;
        });
    };

    // Calculate countdown for upcoming events
    const getCountdown = (date) => {
        const now = new Date();
        const eventDate = new Date(date);
        const diffMs = eventDate - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffDays > 0) {
            return `${diffDays}d ${diffHrs}h`;
        } else if (diffHrs > 0) {
            return `${diffHrs}h ${diffMins}m`;
        } else if (diffMins > 0) {
            return `${diffMins}m`;
        } else {
            return 'Starting soon';
        }
    };

    // Watch for theme changes
    useEffect(() => {
        const handleThemeChange = () => {
            setTheme(localStorage.getItem('theme') || 'dark');
        };

        window.addEventListener('storage', handleThemeChange);
        window.addEventListener('themeChanged', handleThemeChange);

        return () => {
            window.removeEventListener('storage', handleThemeChange);
            window.removeEventListener('themeChanged', handleThemeChange);
        };
    }, []);

    // Carousel auto-rotation
    useEffect(() => {
        carouselInterval.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % featuredEvents.length);
        }, 5000);

        return () => {
            clearInterval(carouselInterval.current);
        };
    }, [featuredEvents.length]);

    const handlePrevSlide = () => {
        clearInterval(carouselInterval.current);
        setCurrentSlide(prev => (prev - 1 + featuredEvents.length) % featuredEvents.length);
    };

    const handleNextSlide = () => {
        clearInterval(carouselInterval.current);
        setCurrentSlide(prev => (prev + 1) % featuredEvents.length);
    };

    const handleLoadMore = () => {
        setVisibleEventCount(prev => prev + 6);
    };

    const handleViewEvent = (eventId) => {
        if (!eventId) {
            console.error("Cannot navigate to undefined event ID");
            return;
        }
        
        // Debug the event ID we're trying to navigate to
        console.log("Navigation: Attempting to navigate to event with ID:", eventId);
        
        // Make sure we're using a string ID
        const targetPath = `/home/events/${String(eventId)}`;
        console.log("Navigation: Target path:", targetPath);
        
        // Navigate without replace
        navigate(targetPath);
    };

    const formatDate = (date) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    // Trigger animations when component mounts
    useEffect(() => {
        // Force a repaint to ensure animations trigger
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        
        // Activate animations with a small delay
        setTimeout(() => {
            setAnimationsActive(true);
        }, 100);
        
        // Clear animation state on unmount
        return () => {
            setAnimationsActive(false);
        };
    }, [location.key]); // Re-run when location changes to trigger animations on route change

    // Change active tab
    const changeTab = (tab) => {
        setActiveTab(tab);
        if (activeSportFilter === 'all') {
            setFilteredEvents(allEvents[tab]);
        } else {
            setFilteredEvents(
                allEvents[tab].filter(event => 
                    event.category.toLowerCase() === activeSportFilter.toLowerCase()
                )
            );
        }
    };
    
    // Toggle sport filter
    const toggleSportFilter = (sport) => {
        setActiveSportFilter(sport);
        
        if (sport === 'all') {
            setFilteredEvents(allEvents[activeTab]);
        } else {
            setFilteredEvents(
                allEvents[activeTab].filter(event => 
                    event.category.toLowerCase() === sport.toLowerCase()
                )
            );
        }
    };
    
    // Initialize filtered events when allEvents or activeTab changes
    useEffect(() => {
        if (allEvents[activeTab]) {
            if (activeSportFilter === 'all') {
                setFilteredEvents(allEvents[activeTab]);
            } else {
                setFilteredEvents(
                    allEvents[activeTab].filter(event => 
                        event.category.toLowerCase() === activeSportFilter.toLowerCase()
                    )
                );
            }
        }
    }, [allEvents, activeTab, activeSportFilter]);

    // Navigate to previous or next slide
    const navigateSlide = (direction) => {
        if (direction === 'prev') {
            setCurrentSlide((prevSlide) => 
                prevSlide === 0 ? featuredEvents.length - 1 : prevSlide - 1
            );
        } else {
            setCurrentSlide((prevSlide) => 
                (prevSlide + 1) % featuredEvents.length
            );
        }
    };
    
    // Extract unique sports from all events
    const sportCategories = [...new Set(
        [...allEvents.ongoing, ...allEvents.upcoming, ...allEvents.past]
            .map(event => event.category)
    )];

    // Add new function to handle direct prediction
    const handleMakePrediction = (event, e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Opening prediction modal for event:", event.id);
        setSelectedEventForPrediction(event);
        setPredictionModalOpen(true);
    };

    return (
        <>
            <Navbar imglink={"https://raw.githubusercontent.com/eseku/betwelts/main/Public/images/logo.png"} />
            <div className={`${styles.eventsContainer} ${animationsActive ? styles.animationsActive : ''}`} data-theme={theme}>
                <div className={styles.eventsContent}>
                    {/* Page Header */}
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Sports Events</h1>
                        <p className={styles.pageDescription}>
                            Explore upcoming and live sporting events, check odds, and place your bets.
                        </p>
                    </div>

                    {/* Featured Events Banner/Carousel */}
                    <div className={styles.featuredBanner}>
                        <div className={styles.carousel} ref={carouselRef}>
                            {featuredEvents.map((event, index) => (
                                <div 
                                    key={event.id}
                                    className={`${styles.carouselSlide} ${index === currentSlide ? styles.active : ''}`}
                                    style={{ backgroundImage: `url(${event.image})` }}
                                >
                                    <div className={styles.carouselOverlay}>
                                        <span className={styles.featuredLabel}>Featured Event</span>
                                        <h2 className={styles.featuredTitle}>{event.title}</h2>
                                        <div className={styles.featuredInfo}>
                                            <div className={styles.infoItem}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                {formatDate(event.date)}
                                            </div>
                                            <div className={styles.infoItem}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                    <circle cx="12" cy="10" r="3"></circle>
                                                </svg>
                                                {event.venue}
                                            </div>
                                            <div className={styles.infoItem}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                {event.status === 'upcoming' ? getCountdown(event.date) : 
                                                 event.status === 'live' ? 'LIVE NOW' : 'Completed'}
                                            </div>
                                        </div>
                                        <button className={styles.featuredCta} onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            console.log(`Navigating to event details for ${event.id}`);
                                            handleViewEvent(event.id);
                                        }}>
                                            {event.status === 'completed' ? 'View Results' : 'View Details'}
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className={styles.carouselNav}>
                                <button className={styles.navButton} onClick={handlePrevSlide}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button className={styles.navButton} onClick={handleNextSlide}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className={styles.filterSection}>
                        <div className={styles.filterTabs}>
                            <div 
                                className={`${styles.filterTab} ${activeTab === 'ongoing' ? styles.active : ''}`}
                                onClick={() => changeTab('ongoing')}
                            >
                                Ongoing
                            </div>
                            <div 
                                className={`${styles.filterTab} ${activeTab === 'upcoming' ? styles.active : ''}`}
                                onClick={() => changeTab('upcoming')}
                            >
                                Upcoming
                            </div>
                            <div 
                                className={`${styles.filterTab} ${activeTab === 'past' ? styles.active : ''}`}
                                onClick={() => changeTab('past')}
                            >
                                Past Events
                            </div>
                        </div>
                        <div className={styles.filterDropdowns}>
                            <div className={styles.filterDropdown}>
                                <button className={styles.dropdownButton}>
                                    {activeSportFilter === 'all' ? 'All Sports' : activeSportFilter}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownItem} onClick={() => toggleSportFilter('all')}>All Categories</div>
                                    {loadingCategories ? (
                                        <div className={styles.dropdownItem}>Loading categories...</div>
                                    ) : (
                                        categories.map((category) => (
                                            <div 
                                                key={category} 
                                                className={styles.dropdownItem} 
                                                onClick={() => toggleSportFilter(category)}
                                            >
                                                {category}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className={styles.eventsGrid}>
                        {filteredEvents.slice(0, visibleEventCount).map(event => (
                            <div key={event.id} className={styles.eventCard}>
                                <div className={`${styles.statusBadge} ${
                                    event.status === 'live' ? styles.statusLive : 
                                    event.status === 'upcoming' ? styles.statusUpcoming : 
                                    styles.statusCompleted
                                }`}>
                                    {event.status === 'live' ? 'LIVE' : 
                                     event.status === 'upcoming' ? 'UPCOMING' : 
                                     'COMPLETED'}
                                </div>
                                <img 
                                    src={event.image} 
                                    alt={event.title} 
                                    className={styles.eventImage}
                                />
                                <div className={styles.eventInfo}>
                                    <div className={styles.eventCategory}>{event.category}</div>
                                    <h3 className={styles.eventTitle}>{event.title}</h3>
                                    
                                    <div className={styles.teamMatch}>
                                        <div className={styles.team}>
                                            <div className={styles.teamLogo}>
                                                {event.options?.option1?.logo || (event.teams?.home?.logo || '')}
                                            </div>
                                            <div className={styles.teamName}>{event.options?.option1?.name || (event.teams?.home?.name || 'Option 1')}</div>
                                        </div>
                                        <div className={styles.versus}>
                                            {event.status === 'live' && event.score ? event.score : 
                                             event.status === 'completed' && event.result ? event.result : 
                                             'VS'}
                                        </div>
                                        <div className={styles.team}>
                                            <div className={styles.teamLogo}>
                                                {event.options?.option2?.logo || (event.teams?.away?.logo || '')}
                                            </div>
                                            <div className={styles.teamName}>{event.options?.option2?.name || (event.teams?.away?.name || 'Option 2')}</div>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.eventMeta}>
                                        <div className={styles.metaItem}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            {formatDate(event.date)}
                                        </div>
                                        <div className={styles.metaItem}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            {event.time}
                                        </div>
                                        <div className={styles.metaItem}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                            {event.venue}
                                        </div>
                                    </div>
                                    
                                    {event.status !== 'completed' && (
                                        <div className={styles.oddsSection}>
                                            {(event.odds?.option1 || event.odds?.home) && (
                                                <div className={styles.oddsItem}>
                                                    <div className={styles.oddsLabel}>
                                                        {event.options?.option1?.name || (event.teams?.home?.name || 'Option 1')}
                                                    </div>
                                                    <div className={styles.oddsValue}>{event.odds?.option1 || event.odds?.home}</div>
                                                </div>
                                            )}
                                            
                                            {(event.odds?.draw) && (
                                                <div className={styles.oddsItem}>
                                                    <div className={styles.oddsLabel}>Draw</div>
                                                    <div className={styles.oddsValue}>{event.odds.draw}</div>
                                                </div>
                                            )}
                                            
                                            {(event.odds?.option2 || event.odds?.away) && (
                                                <div className={styles.oddsItem}>
                                                    <div className={styles.oddsLabel}>
                                                        {event.options?.option2?.name || (event.teams?.away?.name || 'Option 2')}
                                                    </div>
                                                    <div className={styles.oddsValue}>{event.odds?.option2 || event.odds?.away}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className={styles.cardActions}>
                                        {event.status !== 'completed' ? (
                                            <button 
                                                className={`${styles.actionButton} ${styles.betButton}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleViewEvent(event.id);
                                                }}
                                            >
                                                Make Prediction
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </button>
                                        ) : (
                                            <button 
                                                className={`${styles.actionButton} ${styles.primaryButton}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleViewEvent(event.id);
                                                }}
                                            >
                                                View Results
                                            </button>
                                        )}
                                        
                                        <button 
                                            className={`${styles.actionButton} ${styles.secondaryButton}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleViewEvent(event.id);
                                            }}
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Load More Button */}
                    {filteredEvents.length > visibleEventCount && (
                        <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                            Load More
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Prediction Modal */}
            {isPredictionModalOpen && selectedEventForPrediction && (
                <DirectPredictionModal
                    isOpen={isPredictionModalOpen}
                    onClose={() => {
                        setPredictionModalOpen(false);
                        setSelectedEventForPrediction(null);
                        setSelectedOption(null);
                    }}
                    event={selectedEventForPrediction}
                    onConfirm={(data) => {
                        console.log("Prediction confirmed:", data);
                        // Handle prediction confirmation
                        toast.success('Prediction placed successfully!');
                        setPredictionModalOpen(false);
                        setSelectedEventForPrediction(null);
                    }}
                />
            )}
        </>
    );
}

export default EventPage;