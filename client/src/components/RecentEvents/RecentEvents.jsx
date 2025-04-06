import { useState, useEffect } from 'react';
import '../ProfitCard/profitcard.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

export default function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const response = await axios.get(API_URL);
        // Sort by created date (newest first) and take the most recent 3
        const sortedEvents = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setEvents(sortedEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent events:', error);
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  // Format time difference for display
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffMs = now - eventDate;
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffMins > 0) {
      return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="revenue-card">
      <div className="revenue-card-header">
        <p className="revenue-title">Recent Events</p>
      </div>

      <div className="revenue-card-content">
        {loading ? (
          <p>Loading recent events...</p>
        ) : events.length > 0 ? (
          events.map((event) => {
            // Support both options and teams data structures
            const option1Name = event.options?.option1?.name || event.teams?.home?.name || '';
            const option2Name = event.options?.option2?.name || event.teams?.away?.name || '';
            const matchDisplay = option1Name && option2Name ? `${option1Name} vs ${option2Name}` : event.match;
            
            return (
              <div key={event._id} style={{ marginBottom: '8px' }}>
                <strong>{event.title} - {matchDisplay}</strong>
                <p style={{ color: '#cbd5e1', fontSize: '12px' }}>
                  {getTimeAgo(event.createdAt)}
                </p>
              </div>
            );
          })
        ) : (
          <p>No recent events found</p>
        )}
      </div>
    </div>
  );
}
