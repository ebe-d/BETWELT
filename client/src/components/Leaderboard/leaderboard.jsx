import '../ProfitCard/profitcard.css'

const topUsers = [
  { name: 'Ebe', profit: '50 PDR' },
  { name: 'Alex', profit: '40 PDR' },
  { name: 'Sam', profit: '30 PDR' },
];

export default function Leaderboard() {
  return (
    <div className="revenue-card">
      <div className="revenue-card-header">
        <p className="revenue-title">Leaderboard</p>
        <p style={{ color: '#cbd5e1', fontSize: '14px' }}>Top Performers</p>
      </div>

      <div className="revenue-card-content">
        {topUsers.map((user, index) => (
          <div key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{user.name}</span>
            <span style={{ color: '#00ffe0' }}>{user.profit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
