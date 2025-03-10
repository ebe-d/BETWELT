import '../ProfitCard/profitcard.css'
export default function WalletCard() {
  return (
    <div className="revenue-card">
      <div className="revenue-card-header">
        <p className="revenue-title">Wallet Balance</p>
        <div className="revenue-amount">250 PDR</div>
        <p className="revenue-change">Updated Just Now</p>
      </div>

      <div className="revenue-card-content">
        <p style={{ color: '#cbd5e1' }}>Manage your funds and track deposits/withdrawals.</p>
      </div>
    </div>
  );
}
