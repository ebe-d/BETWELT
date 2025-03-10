import './profitcard.css'; // Import your CSS file
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data
const data = [
  { name: 'Jan', value: 50 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 0 },
];

export default function RevenueCard() {
  return (
    <div className="revenue-card">
      <div className="revenue-card-header">
        <p className="revenue-title">Total Profit</p>
        <div className="revenue-amount">50 PDR</div>
        <p className="revenue-change">+50 This month</p>
      </div>

      <div className="revenue-card-content">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#00ff80" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00ff80"
              strokeWidth={2}
              dot={{ fill: "#00ff80" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
