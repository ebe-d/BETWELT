import '../ProfitCard/profitcard.css'

const events = [
  { name: 'Football - Real vs Barca', time: '2 hours ago' },
  { name: 'Basketball - Lakers vs Bulls', time: '5 hours ago' },
  { name: 'Cricket - India vs Aus', time: '1 day ago' },
];

export default function RecentEvents() {
  return (
    <div className="revenue-card">
      <div className="revenue-card-header">
        <p className="revenue-title">Recent Events</p>
      </div>

      <div className="revenue-card-content">
        {events.map((event, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <strong>{event.name}</strong>
            <p style={{ color: '#cbd5e1', fontSize: '12px' }}>{event.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
