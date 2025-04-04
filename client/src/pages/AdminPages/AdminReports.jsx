import React, { useState, useEffect } from 'react';
import './admindashboard.css';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaUsers, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaDownload, 
  FaFilter,
  FaSyncAlt,
  FaTable,
  FaSearch
} from 'react-icons/fa';

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: getOneMonthAgo(),
    to: formatDateForInput(new Date())
  });
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock data
  const [overviewStats, setOverviewStats] = useState({
    newUsers: 0,
    activeBets: 0,
    completedBets: 0,
    totalRevenue: 0,
    growthRate: 0
  });
  
  const [userStats, setUserStats] = useState({
    userGrowth: [],
    usersByRegion: [],
    activeUsers: 0,
    retentionRate: 0
  });
  
  const [bettingStats, setBettingStats] = useState({
    popularEvents: [],
    bettingVolume: [],
    winRate: 0,
    avgBetAmount: 0
  });
  
  const [revenueStats, setRevenueStats] = useState({
    monthlyRevenue: [],
    revenueByCategory: [],
    profitMargin: 0,
    projectedRevenue: 0
  });
  
  // Helper functions for dates
  function getOneMonthAgo() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return formatDateForInput(date);
  }
  
  function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }
  
  // Load mock report data
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        setOverviewStats({
          newUsers: 1842,
          activeBets: 3254,
          completedBets: 12489,
          totalRevenue: 125840.50,
          growthRate: 12.7
        });
        
        setUserStats({
          userGrowth: [
            { date: '2023-07', value: 1250 },
            { date: '2023-08', value: 1420 },
            { date: '2023-09', value: 1540 },
            { date: '2023-10', value: 1650 },
            { date: '2023-11', value: 1780 },
            { date: '2023-12', value: 1842 }
          ],
          usersByRegion: [
            { region: 'North America', count: 3580 },
            { region: 'Europe', count: 2470 },
            { region: 'Asia', count: 1850 },
            { region: 'South America', count: 980 },
            { region: 'Africa', count: 540 },
            { region: 'Australia', count: 350 }
          ],
          activeUsers: 5420,
          retentionRate: 68.5
        });
        
        setBettingStats({
          popularEvents: [
            { event: 'Super Bowl', bets: 1245, volume: 45820 },
            { event: 'NBA Finals', bets: 982, volume: 32560 },
            { event: 'World Cup', bets: 1520, volume: 58760 },
            { event: 'UFC 300', bets: 754, volume: 28450 },
            { event: 'Kentucky Derby', bets: 682, volume: 35280 }
          ],
          bettingVolume: [
            { date: '2023-07', value: 87520 },
            { date: '2023-08', value: 92340 },
            { date: '2023-09', value: 88750 },
            { date: '2023-10', value: 94560 },
            { date: '2023-11', value: 112800 },
            { date: '2023-12', value: 125400 }
          ],
          winRate: 12.3,
          avgBetAmount: 68.75
        });
        
        setRevenueStats({
          monthlyRevenue: [
            { date: '2023-07', value: 87520 * 0.08 },
            { date: '2023-08', value: 92340 * 0.085 },
            { date: '2023-09', value: 88750 * 0.09 },
            { date: '2023-10', value: 94560 * 0.085 },
            { date: '2023-11', value: 112800 * 0.095 },
            { date: '2023-12', value: 125400 * 0.092 }
          ],
          revenueByCategory: [
            { category: 'Sports', value: 48560 },
            { category: 'Politics', value: 12840 },
            { category: 'Entertainment', value: 18650 },
            { category: 'Crypto', value: 32450 },
            { category: 'Other', value: 13340 }
          ],
          profitMargin: 62.8,
          projectedRevenue: 152000
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [dateRange]);
  
  // Handle date filter changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    // In a real app, this would fetch new data based on filters
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilterOpen(false);
    }, 800);
  };
  
  // Handle tab changes
  const changeTab = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle export reports
  const exportReport = (format) => {
    alert(`Exporting ${activeTab} report in ${format} format`);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
      </div>
      <p className="page-description">Visualize platform performance metrics and generate custom reports.</p>
      
      {/* Report Controls */}
      <div className="controls-container">
        <div className="report-tabs">
          <button 
            className={`report-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => changeTab('overview')}
          >
            <FaChartBar /> Overview
          </button>
          <button 
            className={`report-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => changeTab('users')}
          >
            <FaUsers /> User Analytics
          </button>
          <button 
            className={`report-tab ${activeTab === 'betting' ? 'active' : ''}`}
            onClick={() => changeTab('betting')}
          >
            <FaChartLine /> Betting Analytics
          </button>
          <button 
            className={`report-tab ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => changeTab('revenue')}
          >
            <FaMoneyBillWave /> Revenue
          </button>
        </div>
        
        <div className="report-actions">
          <button className="filter-button" onClick={() => setFilterOpen(!filterOpen)}>
            <FaFilter /> Filter
          </button>
          <div className="export-dropdown">
            <button className="export-button">
              <FaDownload /> Export
            </button>
            <div className="export-options">
              <button onClick={() => exportReport('pdf')}>PDF</button>
              <button onClick={() => exportReport('csv')}>CSV</button>
              <button onClick={() => exportReport('xlsx')}>Excel</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters Panel */}
      {filterOpen && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-range-inputs">
              <input 
                type="date" 
                name="from" 
                value={dateRange.from} 
                onChange={handleDateRangeChange}
              />
              <span>to</span>
              <input 
                type="date" 
                name="to" 
                value={dateRange.to} 
                onChange={handleDateRangeChange}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>Categories</label>
            <select>
              <option value="all">All Categories</option>
              <option value="sports">Sports</option>
              <option value="politics">Politics</option>
              <option value="entertainment">Entertainment</option>
              <option value="crypto">Crypto</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Region</label>
            <select>
              <option value="all">All Regions</option>
              <option value="north-america">North America</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="south-america">South America</option>
              <option value="africa">Africa</option>
              <option value="australia">Australia</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button className="apply-filters" onClick={applyFilters}>
              <FaSyncAlt /> Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Overview Report Tab */}
      {activeTab === 'overview' && (
        <div className="report-content">
          <div className="report-stats">
            <div className="stat-card">
              <div className="stat-icon users">
                <FaUsers />
              </div>
              <div className="stat-content">
                <span className="stat-value">{overviewStats.newUsers}</span>
                <span className="stat-label">New Users</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon events">
                <FaChartBar />
              </div>
              <div className="stat-content">
                <span className="stat-value">{overviewStats.activeBets}</span>
                <span className="stat-label">Active Bets</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon completed">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <span className="stat-value">{overviewStats.completedBets}</span>
                <span className="stat-label">Completed Bets</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon revenue">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(overviewStats.totalRevenue)}</span>
                <span className="stat-label">Total Revenue</span>
              </div>
            </div>
          </div>
          
          <div className="reports-row">
            <div className="report-widget">
              <div className="widget-header">
                <h3>Revenue Growth</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder revenue-chart">
                  <FaChartLine className="chart-icon" />
                  <span>Monthly Revenue Chart</span>
                  <div className="chart-data-preview">
                    {revenueStats.monthlyRevenue.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.date}</span>
                        <span className="value">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="report-widget">
              <div className="widget-header">
                <h3>User Growth</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder user-chart">
                  <FaUsers className="chart-icon" />
                  <span>Monthly User Chart</span>
                  <div className="chart-data-preview">
                    {userStats.userGrowth.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.date}</span>
                        <span className="value">{item.value} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="reports-row">
            <div className="report-widget">
              <div className="widget-header">
                <h3>Betting Volume</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder betting-chart">
                  <FaChartBar className="chart-icon" />
                  <span>Monthly Betting Volume</span>
                  <div className="chart-data-preview">
                    {bettingStats.bettingVolume.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.date}</span>
                        <span className="value">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="report-widget">
              <div className="widget-header">
                <h3>Revenue by Category</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder pie-chart">
                  <FaChartPie className="chart-icon" />
                  <span>Category Distribution</span>
                  <div className="chart-data-preview">
                    {revenueStats.revenueByCategory.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.category}</span>
                        <span className="value">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* User Analytics Tab */}
      {activeTab === 'users' && (
        <div className="report-content">
          <div className="report-stats">
            <div className="stat-card">
              <div className="stat-icon users">
                <FaUsers />
              </div>
              <div className="stat-content">
                <span className="stat-value">{userStats.userGrowth[userStats.userGrowth.length - 1].value}</span>
                <span className="stat-label">Current Users</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon events">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <span className="stat-value">{userStats.activeUsers}</span>
                <span className="stat-label">Active Users</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon completed">
                <FaChartPie />
              </div>
              <div className="stat-content">
                <span className="stat-value">{userStats.retentionRate}%</span>
                <span className="stat-label">Retention Rate</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon revenue">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(overviewStats.totalRevenue / userStats.activeUsers)}</span>
                <span className="stat-label">Revenue per User</span>
              </div>
            </div>
          </div>
          
          <div className="reports-row">
            <div className="report-widget">
              <div className="widget-header">
                <h3>User Growth Trend</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder line-chart">
                  <FaChartLine className="chart-icon" />
                  <span>Monthly User Growth</span>
                  <div className="chart-data-preview">
                    {userStats.userGrowth.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.date}</span>
                        <span className="value">{item.value} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="report-widget">
              <div className="widget-header">
                <h3>Users by Region</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder pie-chart">
                  <FaChartPie className="chart-icon" />
                  <span>Regional Distribution</span>
                  <div className="chart-data-preview">
                    {userStats.usersByRegion.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.region}</span>
                        <span className="value">{item.count} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="report-table-container">
            <div className="table-header">
              <h3>User Activity Report</h3>
              <div className="table-actions">
                <div className="search-box">
                  <input type="text" placeholder="Search users..." />
                  <FaSearch className="search-icon" />
                </div>
                <button className="table-action-btn">
                  <FaDownload /> Export
                </button>
              </div>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Active Users</th>
                  <th>New Signups</th>
                  <th>Avg. Bets</th>
                  <th>Avg. Spend</th>
                  <th>Retention</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>North America</td>
                  <td>2240</td>
                  <td>348</td>
                  <td>12.4</td>
                  <td>{formatCurrency(842.50)}</td>
                  <td>72%</td>
                </tr>
                <tr>
                  <td>Europe</td>
                  <td>1680</td>
                  <td>215</td>
                  <td>10.2</td>
                  <td>{formatCurrency(762.80)}</td>
                  <td>68%</td>
                </tr>
                <tr>
                  <td>Asia</td>
                  <td>1050</td>
                  <td>178</td>
                  <td>8.7</td>
                  <td>{formatCurrency(645.30)}</td>
                  <td>64%</td>
                </tr>
                <tr>
                  <td>South America</td>
                  <td>620</td>
                  <td>104</td>
                  <td>7.2</td>
                  <td>{formatCurrency(520.40)}</td>
                  <td>59%</td>
                </tr>
                <tr>
                  <td>Africa</td>
                  <td>320</td>
                  <td>65</td>
                  <td>5.8</td>
                  <td>{formatCurrency(380.20)}</td>
                  <td>52%</td>
                </tr>
                <tr>
                  <td>Australia</td>
                  <td>210</td>
                  <td>42</td>
                  <td>9.3</td>
                  <td>{formatCurrency(690.10)}</td>
                  <td>67%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Betting Analytics Tab */}
      {activeTab === 'betting' && (
        <div className="report-content">
          <div className="report-stats">
            <div className="stat-card">
              <div className="stat-icon users">
                <FaChartBar />
              </div>
              <div className="stat-content">
                <span className="stat-value">{bettingStats.popularEvents.reduce((sum, event) => sum + event.bets, 0)}</span>
                <span className="stat-label">Total Bets</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon events">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(bettingStats.popularEvents.reduce((sum, event) => sum + event.volume, 0))}</span>
                <span className="stat-label">Betting Volume</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon completed">
                <FaChartPie />
              </div>
              <div className="stat-content">
                <span className="stat-value">{bettingStats.winRate}%</span>
                <span className="stat-label">House Win Rate</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon revenue">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(bettingStats.avgBetAmount)}</span>
                <span className="stat-label">Avg. Bet Amount</span>
              </div>
            </div>
          </div>
          
          <div className="reports-row">
            <div className="report-widget">
              <div className="widget-header">
                <h3>Betting Volume Trend</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder line-chart">
                  <FaChartLine className="chart-icon" />
                  <span>Monthly Betting Volume</span>
                  <div className="chart-data-preview">
                    {bettingStats.bettingVolume.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.date}</span>
                        <span className="value">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="report-widget">
              <div className="widget-header">
                <h3>Most Popular Events</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder bar-chart">
                  <FaChartBar className="chart-icon" />
                  <span>Bets by Event</span>
                  <div className="chart-data-preview">
                    {bettingStats.popularEvents.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.event}</span>
                        <span className="value">{item.bets} bets (${item.volume})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="report-table-container">
            <div className="table-header">
              <h3>Event Performance Report</h3>
              <div className="table-actions">
                <div className="search-box">
                  <input type="text" placeholder="Search events..." />
                  <FaSearch className="search-icon" />
                </div>
                <button className="table-action-btn">
                  <FaDownload /> Export
                </button>
              </div>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Total Bets</th>
                  <th>Volume</th>
                  <th>Win Rate</th>
                  <th>Revenue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bettingStats.popularEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{event.event}</td>
                    <td>{event.bets}</td>
                    <td>{formatCurrency(event.volume)}</td>
                    <td>{(8 + Math.random() * 10).toFixed(2)}%</td>
                    <td>{formatCurrency(event.volume * (0.08 + Math.random() * 0.05))}</td>
                    <td>
                      <span className={`status-badge ${index < 2 ? 'active' : 'completed'}`}>
                        {index < 2 ? 'Active' : 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="report-content">
          <div className="report-stats">
            <div className="stat-card">
              <div className="stat-icon users">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(overviewStats.totalRevenue)}</span>
                <span className="stat-label">Total Revenue</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon events">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <span className="stat-value">{overviewStats.growthRate}%</span>
                <span className="stat-label">Growth Rate</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon completed">
                <FaChartPie />
              </div>
              <div className="stat-content">
                <span className="stat-value">{revenueStats.profitMargin}%</span>
                <span className="stat-label">Profit Margin</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon revenue">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatCurrency(revenueStats.projectedRevenue)}</span>
                <span className="stat-label">Projected Revenue</span>
              </div>
            </div>
          </div>
          
          <div className="reports-row">
            <div className="report-widget">
              <div className="widget-header">
                <h3>Revenue Trend</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder line-chart">
                  <FaChartLine className="chart-icon" />
                  <span>Monthly Revenue</span>
                  <div className="chart-data-preview">
                    {revenueStats.monthlyRevenue.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.date}</span>
                        <span className="value">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="report-widget">
              <div className="widget-header">
                <h3>Revenue by Category</h3>
              </div>
              <div className="widget-content chart-container">
                {/* In a real app, this would be a chart component */}
                <div className="chart-placeholder pie-chart">
                  <FaChartPie className="chart-icon" />
                  <span>Category Distribution</span>
                  <div className="chart-data-preview">
                    {revenueStats.revenueByCategory.map((item, index) => (
                      <div key={index} className="data-point">
                        <span className="date">{item.category}</span>
                        <span className="value">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="report-table-container">
            <div className="table-header">
              <h3>Financial Summary</h3>
              <div className="table-actions">
                <div className="search-box">
                  <input type="text" placeholder="Search categories..." />
                  <FaSearch className="search-icon" />
                </div>
                <button className="table-action-btn">
                  <FaDownload /> Export
                </button>
              </div>
            </div>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Revenue</th>
                  <th>Cost</th>
                  <th>Profit</th>
                  <th>Margin</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {revenueStats.revenueByCategory.map((item, index) => {
                  const cost = item.value * (0.3 + Math.random() * 0.2);
                  const profit = item.value - cost;
                  const margin = (profit / item.value * 100).toFixed(2);
                  const growth = (5 + Math.random() * 20).toFixed(2);
                  
                  return (
                    <tr key={index}>
                      <td>{item.category}</td>
                      <td>{formatCurrency(item.value)}</td>
                      <td>{formatCurrency(cost)}</td>
                      <td>{formatCurrency(profit)}</td>
                      <td>{margin}%</td>
                      <td>
                        <span className={`growth-indicator ${growth > 10 ? 'positive' : growth < 5 ? 'negative' : 'neutral'}`}>
                          {growth}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="summary-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{formatCurrency(revenueStats.revenueByCategory.reduce((sum, item) => sum + item.value, 0))}</strong></td>
                  <td><strong>{formatCurrency(revenueStats.revenueByCategory.reduce((sum, item) => sum + item.value * (0.3 + Math.random() * 0.2), 0))}</strong></td>
                  <td><strong>{formatCurrency(revenueStats.revenueByCategory.reduce((sum, item) => {
                    const cost = item.value * (0.3 + Math.random() * 0.2);
                    return sum + (item.value - cost);
                  }, 0))}</strong></td>
                  <td><strong>{revenueStats.profitMargin}%</strong></td>
                  <td><strong>{overviewStats.growthRate}%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
