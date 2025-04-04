import React, { useState, useEffect } from 'react';
import './admindashboard.css';
import './transactions.css';
import { 
  FaMoneyBillWave, 
  FaExchangeAlt, 
  FaSearch, 
  FaFileDownload, 
  FaEye, 
  FaRegTimesCircle,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
  FaUserAlt,
  FaCalendarAlt,
  FaFilter
} from 'react-icons/fa';

const AdminTransactions = () => {
  const mockTransactions = [
    {
      id: 'TRX-001',
      userId: 'USR-1001',
      userName: 'John Smith',
      type: 'deposit',
      amount: 500.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-15T10:30:00',
      paymentMethod: 'credit_card',
      description: 'Account deposit',
      details: {
        cardLast4: '4242',
        processor: 'Stripe'
      }
    },
    {
      id: 'TRX-002',
      userId: 'USR-1002',
      userName: 'Sarah Johnson',
      type: 'withdrawal',
      amount: 250.00,
      currency: 'PDX',
      status: 'pending',
      date: '2024-03-14T14:45:00',
      paymentMethod: 'bank_transfer',
      description: 'Withdrawal request',
      details: {
        bankName: 'Chase',
        accountLast4: '5678'
      }
    },
    {
      id: 'TRX-003',
      userId: 'USR-1003',
      userName: 'Mike Davis',
      type: 'winning',
      amount: 1250.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-13T18:20:00',
      paymentMethod: 'internal',
      description: 'Winning payout for event #EVT-5001',
      details: {
        eventId: 'EVT-5001',
        eventName: 'Lakers vs Warriors'
      }
    },
    {
      id: 'TRX-004',
      userId: 'USR-1004',
      userName: 'Emma Wilson',
      type: 'bet',
      amount: 100.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-12T12:10:00',
      paymentMethod: 'wallet',
      description: 'Bet placed on event #EVT-5002',
      details: {
        eventId: 'EVT-5002',
        eventName: 'Chiefs vs Eagles',
        selection: 'Chiefs to win'
      }
    },
    {
      id: 'TRX-005',
      userId: 'USR-1005',
      userName: 'Alex Brown',
      type: 'deposit',
      amount: 750.00,
      currency: 'PDX',
      status: 'failed',
      date: '2024-03-11T09:15:00',
      paymentMethod: 'crypto',
      description: 'Failed crypto deposit',
      details: {
        currency: 'ETH',
        txHash: '0x1234abcd...'
      }
    },
    {
      id: 'TRX-006',
      userId: 'USR-1006',
      userName: 'Lisa Garcia',
      type: 'withdrawal',
      amount: 500.00,
      currency: 'PDX',
      status: 'rejected',
      date: '2024-03-10T16:40:00',
      paymentMethod: 'crypto',
      description: 'Rejected withdrawal request',
      details: {
        currency: 'BTC',
        address: 'bc1qxy2...'
      }
    },
    {
      id: 'TRX-007',
      userId: 'USR-1001',
      userName: 'John Smith',
      type: 'refund',
      amount: 50.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-09T11:25:00',
      paymentMethod: 'credit_card',
      description: 'Refund for canceled bet',
      details: {
        betId: 'BET-3001',
        eventId: 'EVT-4002'
      }
    },
    {
      id: 'TRX-008',
      userId: 'USR-1007',
      userName: 'Robert Chen',
      type: 'deposit',
      amount: 1000.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-17T09:30:00',
      paymentMethod: 'bank_transfer',
      description: 'Account deposit via bank transfer',
      details: {
        bankName: 'Bank of America',
        accountLast4: '9821'
      }
    },
    {
      id: 'TRX-009',
      userId: 'USR-1008',
      userName: 'Maria Rodriguez',
      type: 'withdrawal',
      amount: 1500.00,
      currency: 'PDX',
      status: 'pending',
      date: '2024-03-17T11:45:00',
      paymentMethod: 'bank_transfer',
      description: 'Withdrawal to bank account',
      details: {
        bankName: 'Wells Fargo',
        accountLast4: '4567'
      }
    },
    {
      id: 'TRX-010',
      userId: 'USR-1009',
      userName: 'David Wilson',
      type: 'bet',
      amount: 250.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-16T15:20:00',
      paymentMethod: 'wallet',
      description: 'Bet placed on event #EVT-5003',
      details: {
        eventId: 'EVT-5003',
        eventName: 'Yankees vs Red Sox',
        selection: 'Yankees to win'
      }
    },
    {
      id: 'TRX-011',
      userId: 'USR-1002',
      userName: 'Sarah Johnson',
      type: 'winning',
      amount: 450.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-16T18:10:00',
      paymentMethod: 'internal',
      description: 'Winning payout for event #EVT-5002',
      details: {
        eventId: 'EVT-5002',
        eventName: 'Chiefs vs Eagles'
      }
    },
    {
      id: 'TRX-012',
      userId: 'USR-1010',
      userName: 'James Parker',
      type: 'deposit',
      amount: 300.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-16T10:15:00',
      paymentMethod: 'credit_card',
      description: 'Account deposit',
      details: {
        cardLast4: '8765',
        processor: 'Stripe'
      }
    },
    {
      id: 'TRX-013',
      userId: 'USR-1005',
      userName: 'Alex Brown',
      type: 'deposit',
      amount: 500.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-15T14:20:00',
      paymentMethod: 'crypto',
      description: 'Crypto deposit',
      details: {
        currency: 'ETH',
        txHash: '0xabc123def456...'
      }
    },
    {
      id: 'TRX-014',
      userId: 'USR-1011',
      userName: 'Sophia Martinez',
      type: 'bet',
      amount: 75.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-15T16:30:00',
      paymentMethod: 'wallet',
      description: 'Bet placed on event #EVT-5004',
      details: {
        eventId: 'EVT-5004',
        eventName: 'UFC 287: Main Event',
        selection: 'Fighter A to win'
      }
    },
    {
      id: 'TRX-015',
      userId: 'USR-1012',
      userName: 'William Taylor',
      type: 'withdrawal',
      amount: 800.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-14T09:40:00',
      paymentMethod: 'bank_transfer',
      description: 'Withdrawal to bank account',
      details: {
        bankName: 'Citibank',
        accountLast4: '3210'
      }
    },
    {
      id: 'TRX-016',
      userId: 'USR-1013',
      userName: 'Olivia White',
      type: 'winning',
      amount: 180.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-14T12:50:00',
      paymentMethod: 'internal',
      description: 'Winning payout for event #EVT-5003',
      details: {
        eventId: 'EVT-5003',
        eventName: 'Yankees vs Red Sox'
      }
    },
    {
      id: 'TRX-017',
      userId: 'USR-1004',
      userName: 'Emma Wilson',
      type: 'withdrawal',
      amount: 300.00,
      currency: 'PDX',
      status: 'rejected',
      date: '2024-03-13T10:35:00',
      paymentMethod: 'crypto',
      description: 'Invalid crypto address provided',
      details: {
        currency: 'BTC',
        address: 'Invalid address format'
      }
    },
    {
      id: 'TRX-018',
      userId: 'USR-1014',
      userName: 'Ethan Davis',
      type: 'deposit',
      amount: 1200.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-13T13:15:00',
      paymentMethod: 'credit_card',
      description: 'Account deposit',
      details: {
        cardLast4: '1122',
        processor: 'Stripe'
      }
    },
    {
      id: 'TRX-019',
      userId: 'USR-1015',
      userName: 'Ava Johnson',
      type: 'bet',
      amount: 150.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-12T15:25:00',
      paymentMethod: 'wallet',
      description: 'Bet placed on event #EVT-5005',
      details: {
        eventId: 'EVT-5005',
        eventName: 'Premier League: Arsenal vs Chelsea',
        selection: 'Draw'
      }
    },
    {
      id: 'TRX-020',
      userId: 'USR-1016',
      userName: 'Noah Wilson',
      type: 'refund',
      amount: 125.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-12T09:10:00',
      paymentMethod: 'credit_card',
      description: 'Refund for canceled event',
      details: {
        betId: 'BET-3005',
        eventId: 'EVT-4006'
      }
    },
    {
      id: 'TRX-021',
      userId: 'USR-1017',
      userName: 'Lucas Thompson',
      type: 'deposit',
      amount: 2000.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-11T08:30:00',
      paymentMethod: 'bank_transfer',
      description: 'Initial account funding',
      details: {
        bankName: 'TD Bank',
        accountLast4: '7890'
      }
    },
    {
      id: 'TRX-022',
      userId: 'USR-1018',
      userName: 'Isabella Clark',
      type: 'bet',
      amount: 500.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-11T13:20:00',
      paymentMethod: 'wallet',
      description: 'Bet placed on event #EVT-5006',
      details: {
        eventId: 'EVT-5006',
        eventName: 'Formula 1: Monaco Grand Prix',
        selection: 'Driver A to win'
      }
    },
    {
      id: 'TRX-023',
      userId: 'USR-1019',
      userName: 'Benjamin Martin',
      type: 'withdrawal',
      amount: 1200.00,
      currency: 'PDX',
      status: 'pending',
      date: '2024-03-10T14:15:00',
      paymentMethod: 'crypto',
      description: 'Withdrawal to BTC wallet',
      details: {
        currency: 'BTC',
        address: 'bc1qz9f4...'
      }
    },
    {
      id: 'TRX-024',
      userId: 'USR-1020',
      userName: 'Mia Anderson',
      type: 'winning',
      amount: 1750.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-10T16:45:00',
      paymentMethod: 'internal',
      description: 'Winning payout for event #EVT-5006',
      details: {
        eventId: 'EVT-5006',
        eventName: 'Formula 1: Monaco Grand Prix'
      }
    },
    {
      id: 'TRX-025',
      userId: 'USR-1021',
      userName: 'Jacob Lewis',
      type: 'deposit',
      amount: 300.00,
      currency: 'PDX',
      status: 'failed',
      date: '2024-03-09T09:50:00',
      paymentMethod: 'credit_card',
      description: 'Failed deposit due to insufficient funds',
      details: {
        cardLast4: '5432',
        processor: 'Stripe',
        errorCode: 'insufficient_funds'
      }
    },
    {
      id: 'TRX-026',
      userId: 'USR-1017',
      userName: 'Lucas Thompson',
      type: 'bet',
      amount: 350.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-09T12:10:00',
      paymentMethod: 'wallet',
      description: 'Bet placed on event #EVT-5007',
      details: {
        eventId: 'EVT-5007',
        eventName: 'NBA Finals: Game 1',
        selection: 'Team B to win'
      }
    },
    {
      id: 'TRX-027',
      userId: 'USR-1022',
      userName: 'Charlotte Walker',
      type: 'refund',
      amount: 200.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-08T15:30:00',
      paymentMethod: 'wallet',
      description: 'Refund for postponed event',
      details: {
        betId: 'BET-3010',
        eventId: 'EVT-4010',
        reason: 'Event postponed'
      }
    },
    {
      id: 'TRX-028',
      userId: 'USR-1003',
      userName: 'Mike Davis',
      type: 'withdrawal',
      amount: 950.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-08T10:20:00',
      paymentMethod: 'bank_transfer',
      description: 'Withdrawal to checking account',
      details: {
        bankName: 'US Bank',
        accountLast4: '1357'
      }
    },
    {
      id: 'TRX-029',
      userId: 'USR-1023',
      userName: 'Amelia Thomas',
      type: 'deposit',
      amount: 1500.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-07T13:40:00',
      paymentMethod: 'crypto',
      description: 'Deposit via Bitcoin',
      details: {
        currency: 'BTC',
        txHash: '0xdef456abc789...'
      }
    },
    {
      id: 'TRX-030',
      userId: 'USR-1024',
      userName: 'Daniel Harris',
      type: 'winning',
      amount: 890.00,
      currency: 'PDX',
      status: 'completed',
      date: '2024-03-07T17:15:00',
      paymentMethod: 'internal',
      description: 'Winning payout for event #EVT-5007',
      details: {
        eventId: 'EVT-5007',
        eventName: 'NBA Finals: Game 1'
      }
    }
  ];

  // State for transactions data
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTransactions: mockTransactions.length,
    totalVolume: mockTransactions.reduce((sum, trx) => 
      trx.status === 'completed' ? sum + trx.amount : sum, 0),
    deposits: mockTransactions.filter(t => 
      t.type === 'deposit' && t.status === 'completed').length,
    withdrawals: mockTransactions.filter(t => 
      t.type === 'withdrawal' && t.status === 'completed').length,
    pendingTransactions: mockTransactions.filter(t => 
      t.status === 'pending').length
  });
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  
  // State for modal
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Load mock data for transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        console.log('Setting mock transactions:', mockTransactions);
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        
        // Calculate stats
        const totalVolume = mockTransactions.reduce((sum, trx) => 
          trx.status === 'completed' ? sum + trx.amount : sum, 0);
        
        const deposits = mockTransactions.filter(t => 
          t.type === 'deposit' && t.status === 'completed').length;
        
        const withdrawals = mockTransactions.filter(t => 
          t.type === 'withdrawal' && t.status === 'completed').length;
        
        const pending = mockTransactions.filter(t => t.status === 'pending').length;
        
        setStats({
          totalTransactions: mockTransactions.length,
          totalVolume,
          deposits,
          withdrawals,
          pendingTransactions: pending
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Apply filters when any filter changes
  useEffect(() => {
    console.log('Filter effect running with:', {
      transactions: transactions.length,
      searchTerm,
      typeFilter,
      statusFilter,
      dateRange
    });

    if (!transactions.length) return;

    let results = [...transactions];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(trx => 
        trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(trx => trx.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(trx => trx.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      results = results.filter(trx => new Date(trx.date) >= fromDate);
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      results = results.filter(trx => new Date(trx.date) <= toDate);
    }
    
    console.log('Filtered results:', results);
    setFilteredTransactions(results);
  }, [searchTerm, typeFilter, statusFilter, dateRange, transactions]);
  
  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  const formatAmount = (amount, type) => {
    let prefix = '';
    if (type === 'deposit' || type === 'winning' || type === 'refund') {
      prefix = '+';
    } else if (type === 'withdrawal' || type === 'bet') {
      prefix = '-';
    }
    
    return `${prefix}${amount.toFixed(2)}`;
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge completed">Completed</span>;
      case 'pending':
        return <span className="status-badge pending">Pending</span>;
      case 'failed':
        return <span className="status-badge suspended">Failed</span>;
      case 'rejected':
        return <span className="status-badge suspended">Rejected</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'deposit':
        return <span className="category-tag crypto">Deposit</span>;
      case 'withdrawal':
        return <span className="category-tag politics">Withdrawal</span>;
      case 'bet':
        return <span className="category-tag sports">Bet</span>;
      case 'winning':
        return <span className="category-tag entertainment">Winning</span>;
      case 'refund':
        return <span className="category-tag">Refund</span>;
      default:
        return <span className="category-tag">{type}</span>;
    }
  };
  
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <FaArrowDown className="icon-success" />;
      case 'withdrawal':
        return <FaArrowUp className="icon-warning" />;
      case 'bet':
        return <FaExchangeAlt />;
      case 'winning':
        return <FaMoneyBillWave className="icon-success" />;
      case 'refund':
        return <FaExchangeAlt className="icon-info" />;
      default:
        return <FaExchangeAlt />;
    }
  };
  
  // Handle view transaction details
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };
  
  // Export transactions to CSV
  const handleExportCSV = () => {
    // In a real implementation, this would generate and download a CSV file
    alert("This would download a CSV of the current filtered transactions");
  };
  
  // Handle date range changes
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  if (loading) {
    return (
      <div className="loading-interface">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading transaction data...</div>
        <div className="loading-info">Please wait while we fetch the latest transaction information</div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="page-header">
        <h1>Transactions</h1>
        <p className="page-description">View and manage all financial transactions in the system.</p>
      </div>
      
      {/* Transaction Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon transactions">
            <FaExchangeAlt />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalTransactions}</span>
            <span className="stat-label">Total Transactions</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalVolume.toFixed(2)} PDX</span>
            <span className="stat-label">Transaction Volume</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon events">
            <FaArrowDown />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.deposits}</span>
            <span className="stat-label">Deposits</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <FaArrowUp />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.withdrawals}</span>
            <span className="stat-label">Withdrawals</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon users">
            <FaRegTimesCircle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pendingTransactions}</span>
            <span className="stat-label">Pending Transactions</span>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="controls-container">
        <div className="search-and-filters">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search by ID, user or transaction details..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          
          <div className="filters">
            <div className="filter-group">
              <label><FaFilter /> Type</label>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="bet">Bets</option>
                <option value="winning">Winnings</option>
                <option value="refund">Refunds</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label><FaFilter /> Status</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="transactions-date-filter">
              <label><FaCalendarAlt /> From</label>
              <input 
                type="date" 
                name="from"
                value={dateRange.from}
                onChange={handleDateRangeChange}
              />
            </div>
            
            <div className="transactions-date-filter">
              <label><FaCalendarAlt /> To</label>
              <input 
                type="date" 
                name="to"
                value={dateRange.to}
                onChange={handleDateRangeChange}
              />
            </div>
          </div>
        </div>
        
        <button className="add-button" onClick={handleExportCSV}>
          <FaFileDownload /> Export CSV
        </button>
      </div>
      
      {/* Transactions Table */}
      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date & Time</th>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions && filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    <div className="user-info">
                      <FaUserAlt className="user-icon" />
                      <span>{transaction.userName}</span>
                    </div>
                  </td>
                  <td>{getTypeLabel(transaction.type)}</td>
                  <td>
                    <span className={`amount ${transaction.type === 'deposit' || transaction.type === 'winning' || transaction.type === 'refund' ? 'positive' : 'negative'}`}>
                      {formatAmount(transaction.amount, transaction.type)} {transaction.currency}
                    </span>
                  </td>
                  <td>{getStatusBadge(transaction.status)}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => handleViewTransaction(transaction)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  {loading ? 'Loading transactions...' : 'No transactions found matching the current filters'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content transaction-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="transaction-details">
                <div className="transaction-header">
                  <div className="transaction-id">
                    <strong>Transaction ID:</strong> {selectedTransaction.id}
                  </div>
                  <div className="transaction-status">
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>
                
                <div className="transaction-info-grid">
                  <div className="transaction-info-item">
                    <label>Type</label>
                    <div className="info-value">{getTypeLabel(selectedTransaction.type)}</div>
                  </div>
                  
                  <div className="transaction-info-item">
                    <label>Amount</label>
                    <div className={`info-value amount ${selectedTransaction.type === 'deposit' || selectedTransaction.type === 'winning' || selectedTransaction.type === 'refund' ? 'positive' : 'negative'}`}>
                      {formatAmount(selectedTransaction.amount, selectedTransaction.type)} {selectedTransaction.currency}
                    </div>
                  </div>
                  
                  <div className="transaction-info-item">
                    <label>Date & Time</label>
                    <div className="info-value">{formatDate(selectedTransaction.date)}</div>
                  </div>
                  
                  <div className="transaction-info-item">
                    <label>Payment Method</label>
                    <div className="info-value">{selectedTransaction.paymentMethod.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                  </div>
                  
                  <div className="transaction-info-item wide">
                    <label>Description</label>
                    <div className="info-value">{selectedTransaction.description}</div>
                  </div>
                  
                  <div className="transaction-info-item wide">
                    <label>User</label>
                    <div className="info-value">
                      <FaUserAlt className="user-icon" />
                      <span>{selectedTransaction.userName}</span>
                      <span className="user-id">({selectedTransaction.userId})</span>
                    </div>
                  </div>
                  
                  <div className="transaction-details-section">
                    <h3>Additional Details</h3>
                    <div className="details-grid">
                      {selectedTransaction.details && Object.entries(selectedTransaction.details).map(([key, value]) => (
                        <div className="transaction-info-item" key={key}>
                          <label>{key.split(/(?=[A-Z])/).join(' ').replace(/^./, str => str.toUpperCase())}</label>
                          <div className="info-value">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedTransaction.status === 'pending' && (
                  <div className="transaction-actions">
                    <button className="approve-btn">
                      <FaCheckCircle /> Approve Transaction
                    </button>
                    <button className="reject-btn">
                      <FaRegTimesCircle /> Reject Transaction
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
