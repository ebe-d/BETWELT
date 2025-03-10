import '../ProfitCard/profitcard.css'

export default function MonthlyRevenueCard() {
  return (
    <div className="revenue-card">
      <div className="revenue-card-header">
        <p className="revenue-title">Monthly Revenue</p>
        <div className="revenue-amount">500 PDR</div>
        <p className="revenue-change">+200 This Month</p>
      </div>

      <div className="revenue-card-content">
        <p style={{ color: '#cbd5e1' }}>Revenue generated from your entries and bets.</p>
      </div>
    </div>
  );
}
