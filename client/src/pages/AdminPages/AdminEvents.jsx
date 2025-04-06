import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaCalendarAlt, FaSearch, FaUpload, FaList, FaTags, FaFlag, FaTimes, FaCheckCircle, FaStar, FaFlagCheckered } from 'react-icons/fa';
import './admindashboard.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getClerkToken, getAuthHeaders } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/events';

const AdminEvents = () => {
  // State for events management
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  
  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  
  // Add new state for result declaration
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState({
    homeScore: '',
    awayScore: '',
    winningOption: '',
    status: 'completed'
  });

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    match: '',
    category: 'Sports',
    date: '',
    time: '',
    venue: '',
    status: 'upcoming',
    image: '',
    description: '',
    options: {
      option1: {
        name: '',
        logo: ''
      },
      option2: {
        name: '',
        logo: ''
      }
    },
    odds: {
      option1: 1.0,
      draw: 0,
      option2: 1.0
    }
  });

  // State for categories from the database
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  // Ensure we have a token when the component loads
  useEffect(() => {
    const initializeAuth = async () => {
      await getClerkToken();
    };
    
    initializeAuth();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        // Extract category names from the response
        const categoryNames = response.data.map(category => category.name);
        setCategories(categoryNames);
        setLoadingCategories(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Load events from API
  useEffect(() => {
    fetchEvents();
  }, [statusFilter, categoryFilter]);

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Build query params
      let queryParams = '';
      if (statusFilter !== 'all') {
        queryParams += `status=${statusFilter}&`;
      }
      if (categoryFilter !== 'all') {
        queryParams += `category=${categoryFilter}&`;
      }
      
      // Get the token
      const token = await getClerkToken();
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Use the headers in the request
      const response = await axios.get(`${API_URL}?${queryParams}`, { headers });
      
      setEvents(response.data);
      setFilteredEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
      setLoading(false);
    }
  };

  // Filter events based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, events]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset form for adding new event
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setNewEvent({
      title: '',
      match: '',
      category: 'Sports',
      date: '',
      time: '',
      venue: '',
      status: 'upcoming',
      image: '',
      description: '',
      options: {
        option1: {
          name: '',
          logo: ''
        },
        option2: {
          name: '',
          logo: ''
        }
      },
      odds: {
        option1: 1.0,
        draw: 0,
        option2: 1.0
      }
    });
    setShowAddModal(true);
  };

  // Prepare form for editing event
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    
    // Convert from old field structure if needed
    const formattedEvent = {
      ...event,
      options: event.options || {
        option1: event.teams?.home || { name: '', logo: '' },
        option2: event.teams?.away || { name: '', logo: '' }
      },
      odds: {
        option1: event.odds?.option1 || event.odds?.home || 1.0,
        draw: event.odds?.draw || 0,
        option2: event.odds?.option2 || event.odds?.away || 1.0
      }
    };
    
    setNewEvent(formattedEvent);
    setShowEditModal(true);
  };

  // Handle input change
  const handleInputChange = (name, value) => {
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle team details changes
  const handleTeamChange = (team, field, value) => {
    setNewEvent(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [team]: {
          ...prev.options[team],
          [field]: value
        }
      }
    }));
  };

  // Handle odds changes
  const handleOddsChange = (type, value) => {
    setNewEvent(prev => ({
      ...prev,
      odds: {
        ...prev.odds,
        [type]: value
      }
    }));
  };

  // Function to handle saving an event (create or update)
  const handleSaveEvent = async () => {
    console.log("Save button clicked");
    
    // Basic form validation
    if (!newEvent.title || !newEvent.match || !newEvent.date || !newEvent.time || !newEvent.venue) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!newEvent.options.option1.name || !newEvent.options.option2.name) {
      toast.error('Please provide names for both prediction options');
      return;
    }

    // Get the form data directly
    const eventData = {
      title: newEvent.title,
      match: newEvent.match, // This field name could be changed to "event" or "prediction" in a future update
      category: newEvent.category,
      date: newEvent.date,
      time: newEvent.time,
      venue: newEvent.venue,
      status: newEvent.status,
      image: newEvent.image || '',
      description: newEvent.description || '',
      options: { // "options" field could be renamed to "options" in a future update
        option1: { // "option1" could be renamed to "option1" 
          name: newEvent.options.option1.name,
          logo: newEvent.options.option1.logo || ''
        },
        option2: { // "option2" could be renamed to "option2"
          name: newEvent.options.option2.name,
          logo: newEvent.options.option2.logo || ''
        }
      },
      odds: { // odds structure matches the API's expected format
        option1: parseFloat(newEvent.odds.option1) || 1.0, // "option1" could be renamed to "option1"
        draw: parseFloat(newEvent.odds.draw) || 0,
        option2: parseFloat(newEvent.odds.option2) || 1.0 // "option2" could be renamed to "option2"
      }
    };
    
    console.log("Sending event data:", eventData);
    
    try {
      // Get the token 
      const token = await getClerkToken();
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      if (showAddModal) {
        // Add new event
        const response = await axios.post(API_URL, eventData, { headers });
        console.log('Server response:', response.data);
        toast.success('Event created successfully');
        setShowAddModal(false);
      } else {
        // Update existing event
        const response = await axios.put(`${API_URL}/${currentEvent._id}`, eventData, { headers });
        console.log('Server response:', response.data);
        toast.success('Event updated successfully');
        setShowEditModal(false);
      }
      
      // Refresh the events list
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error.response?.data?.message || 'Failed to save event');
    }
  };

  // Delete event
  const handleDeleteEvent = async (id) => {
    // Instead of window.confirm, set the event to delete and show the modal
    const eventToDelete = events.find(event => event._id === id);
    setEventToDelete(eventToDelete);
    setShowDeleteModal(true);
  };

  // Confirm deletion from modal
  const confirmDeleteEvent = async () => {
    try {
      // Get the token
      const token = await getClerkToken();
      
      // Use the token directly in the request
      await axios.delete(`${API_URL}/${eventToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Event deleted successfully');
      setShowDeleteModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  // Cancel deletion
  const cancelDeleteEvent = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  // Toggle featured status
  const handleToggleFeatured = async (id) => {
    try {
      // Get the token
      const token = await getClerkToken();
      
      // Use the token directly in the request
      await axios.put(`${API_URL}/${id}/featured`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Featured status toggled successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Open result declaration modal
  const handleDeclareResult = (event) => {
    setCurrentEvent(event);
    setResultData({
      homeScore: event.score ? event.score.split('-')[0] : '',
      awayScore: event.score ? event.score.split('-')[1] : '',
      winningOption: '',
      status: 'completed'
    });
    setShowResultModal(true);
  };

  // Close result declaration modal
  const closeResultModal = () => {
    setShowResultModal(false);
    setCurrentEvent(null);
  };

  // Handle result form input changes
  const handleResultChange = (e) => {
    const { name, value } = e.target;
    setResultData({
      ...resultData,
      [name]: value
    });
  };

  // Submit event result
  const submitResult = async () => {
    if (!resultData.homeScore || !resultData.awayScore) {
      toast.error('Please enter scores for both teams');
      return;
    }
    
    // Create score string
    const score = `${resultData.homeScore}-${resultData.awayScore}`;
    
    // Determine result text
    let result = '';
    if (parseInt(resultData.homeScore) > parseInt(resultData.awayScore)) {
      result = `${currentEvent.options.option1.name} wins`;
    } else if (parseInt(resultData.homeScore) < parseInt(resultData.awayScore)) {
      result = `${currentEvent.options.option2.name} wins`;
    } else {
      result = 'Draw';
    }
    
    try {
      // Get the token
      const token = await getClerkToken();
      
      // Use the token directly in the request
      await axios.put(`${API_URL}/${currentEvent._id}/result`, {
        score,
        result,
        status: 'completed'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Result recorded successfully');
      closeResultModal();
      fetchEvents();
    } catch (error) {
      console.error('Error recording result:', error);
      toast.error('Failed to record result');
    }
  };

  // Add the result declaration actions to the table
  const renderActionButtons = (event) => {
    return (
      <div className="actions-cell">
        <button className="action-btn view" title="View details">
          <FaEye />
        </button>
        <button 
          className="action-btn edit" 
          title="Edit event"
          onClick={() => handleEditEvent(event)}
        >
          <FaEdit />
        </button>
        <button 
          className="action-btn delete" 
          title="Delete event"
          onClick={() => handleDeleteEvent(event._id)}
        >
          <FaTrash />
        </button>
        {event.status === 'live' && (
          <button 
            className="action-btn declare-result" 
            title="Declare result"
            onClick={() => handleDeclareResult(event)}
          >
            <FaFlagCheckered />
          </button>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading events data...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Event Management</h1>
        <p className="page-description">Create, manage and declare results for upcoming and live events.</p>
      </div>

      {/* Controls */}
      <div className="controls-container">
        <div className="search-and-filters">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label><FaFilter /> Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="filter-group">
              <label><FaTags /> Category:</label>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button className="add-button" style={{marginBlockEnd:"15px",marginLeft:"-15px",width:"50px"}} onClick={handleAddEvent}>
          <FaPlus /> Add New Event
        </button>
      </div>

      {/* Events Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Match</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.category}</td>
                  <td className="match-teams">
                    {(event.options?.option1?.name || event.teams?.home?.name) + ' vs ' + 
                     (event.options?.option2?.name || event.teams?.away?.name)}
                  </td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.time}</td>
                  <td>
                    <span className={`status-badge ${event.status}`}>{event.status}</span>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEditEvent(event)}>
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteEvent(event._id)}>
                      <FaTrash />
                    </button>
                    {event.status === 'live' && (
                      <button className="action-btn result" onClick={() => handleDeclareResult(event)}>
                        <FaFlagCheckered />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No events found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Event Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{showAddModal ? 'Add New Event' : 'Edit Event'}</h2>
              <button 
                className="close-modal-btn"
                onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <form 
                className="event-form" 
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Form submission prevented");
                  return false;
                }}
              >
                <div className="form-section">
                  <h3>Basic Information</h3>
                  
                  <div className="form-group">
                    <label htmlFor="title">Event Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newEvent.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g. Premier League"
                      required
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Prediction Topic *</label>
                    <input
                      type="text"
                      value={newEvent.match}
                      onChange={(e) => handleInputChange('match', e.target.value)}
                      placeholder="e.g. Who will win the election?"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={newEvent.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="status">Status *</label>
                      <select
                        id="status"
                        name="status"
                        value={newEvent.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        required
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="live">Live</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">Date *</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={newEvent.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="time">Time *</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={newEvent.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="venue">Location/Venue *</label>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={newEvent.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="e.g. Online / Washington D.C."
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="image">Image URL</label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={newEvent.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={newEvent.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Provide a detailed description of the event"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Prediction Options</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Option 1 Name *</label>
                      <input
                        type="text"
                        value={newEvent.options.option1.name}
                        onChange={(e) => handleTeamChange('option1', 'name', e.target.value)}
                        placeholder="e.g. Yes / Team A / Candidate 1"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Option 1 Icon/Abbreviation</label>
                      <input
                        type="text"
                        value={newEvent.options.option1.logo}
                        onChange={(e) => handleTeamChange('option1', 'logo', e.target.value)}
                        placeholder="e.g. YES / A / Icon name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Option 2 Name *</label>
                      <input
                        type="text"
                        value={newEvent.options.option2.name}
                        onChange={(e) => handleTeamChange('option2', 'name', e.target.value)}
                        placeholder="e.g. No / Team B / Candidate 2"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Option 2 Icon/Abbreviation</label>
                      <input
                        type="text"
                        value={newEvent.options.option2.logo}
                        onChange={(e) => handleTeamChange('option2', 'logo', e.target.value)}
                        placeholder="e.g. NO / B / Icon name"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Odds Information</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Option 1 Odds *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={newEvent.odds.option1}
                        onChange={(e) => handleOddsChange('option1', e.target.value)}
                        placeholder="e.g. 2.10"
                        required
                      />
                    </div>
                    
                    {(newEvent.category === 'Sports' || newEvent.category === 'Politics') && (
                      <div className="form-group">
                        <label>Draw/Tie Odds</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          value={newEvent.odds.draw}
                          onChange={(e) => handleOddsChange('draw', e.target.value)}
                          placeholder="e.g. 3.40"
                        />
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label>Option 2 Odds *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={newEvent.odds.option2}
                        onChange={(e) => handleOddsChange('option2', e.target.value)}
                        placeholder="e.g. 3.80"
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                type="button"
                onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                type="button"
                onClick={handleSaveEvent}
              >
                {showAddModal ? 'Create Event' : 'Update Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Declaration Modal */}
      {showResultModal && currentEvent && (
        <div className="modal-overlay">
          <div className="modal-content result-modal">
            <div className="modal-header">
              <h2>Declare Result</h2>
              <button className="close-modal-btn" onClick={closeResultModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="match-details">
                <h3>{currentEvent.match}</h3>
                <p>{formatDate(currentEvent.date)} • {currentEvent.venue}</p>
              </div>
              
              <div className="score-input-container">
                <div className="team-score">
                  <label>{currentEvent.options.option1.name}</label>
                  <input 
                    type="number" 
                    name="homeScore"
                    value={resultData.homeScore}
                    onChange={handleResultChange}
                    min="0"
                  />
                </div>
                
                <div className="score-separator">-</div>
                
                <div className="team-score">
                  <label>{currentEvent.options.option2.name}</label>
                  <input 
                    type="number" 
                    name="awayScore"
                    value={resultData.awayScore}
                    onChange={handleResultChange}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeResultModal}>Cancel</button>
              <button className="save-btn" onClick={submitResult}>Record Result</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h2>Delete Event</h2>
              <button className="close-modal-btn" onClick={cancelDeleteEvent}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="warning-icon">
                <FaTrash />
              </div>
              <h3>Are you sure you want to delete this event?</h3>
              <div className="event-delete-details">
                <p><strong>Title:</strong> {eventToDelete.title}</p>
                <p><strong>Match:</strong> {eventToDelete.match}</p>
                <p><strong>Category:</strong> {eventToDelete.category}</p>
                <p><strong>Date:</strong> {formatDate(eventToDelete.date)}</p>
              </div>
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={cancelDeleteEvent}>Cancel</button>
              <button className="delete-btn" onClick={confirmDeleteEvent}>
                <FaTrash /> Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents; 