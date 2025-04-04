import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaEye, FaEdit, FaBan, FaCheck, FaTimes, FaLock, FaUnlock, FaUser, FaUserShield, FaUsers, FaMoneyBillWave, FaHistory, FaEnvelope } from 'react-icons/fa';
import './admindashboard.css';
import './adminusers.css';
import './transactions.css';

const AdminUsers = () => {
  // State for users management
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingVerification: 0,
    suspendedUsers: 0
  });

  // Load mock data
  useEffect(() => {
    // Simulating API call to fetch users
    setTimeout(() => {
      const mockUsers = [
        {
          id: 1,
          username: "john_doe",
          email: "john.doe@example.com",
          fullName: "John Doe",
          status: "active",
          role: "user",
          joinDate: "2023-01-15",
          lastLogin: "2023-05-22T14:30:45",
          verificationStatus: "verified",
          totalBets: 47,
          winRate: 62,
          accountBalance: 1250.75,
          transactions: [
            { id: 101, type: "deposit", amount: 500, date: "2023-05-10T10:15:30", status: "completed" },
            { id: 102, type: "withdrawal", amount: 200, date: "2023-05-15T16:20:10", status: "completed" },
            { id: 103, type: "deposit", amount: 300, date: "2023-05-20T09:45:22", status: "completed" },
            { id: 111, type: "deposit", amount: 250, date: "2023-05-25T14:30:45", status: "completed" },
            { id: 112, type: "withdrawal", amount: 125, date: "2023-05-28T11:20:10", status: "completed" },
            { id: 113, type: "deposit", amount: 500, date: "2023-06-02T09:15:30", status: "completed" },
            { id: 114, type: "withdrawal", amount: 350, date: "2023-06-10T16:45:20", status: "completed" }
          ],
          bettingActivity: [
            { id: 201, event: "Lakers vs Warriors", selection: "Warriors", amount: 100, result: "win", date: "2023-05-18T20:30:00" },
            { id: 202, event: "Chiefs vs Ravens", selection: "Chiefs", amount: 50, result: "loss", date: "2023-05-19T18:15:00" }
          ]
        },
        {
          id: 2,
          username: "alice_smith",
          email: "alice.smith@example.com",
          fullName: "Alice Smith",
          status: "active",
          role: "premium",
          joinDate: "2023-02-10",
          lastLogin: "2023-05-21T09:15:22",
          verificationStatus: "verified",
          totalBets: 32,
          winRate: 58,
          accountBalance: 875.50,
          transactions: [
            { id: 104, type: "deposit", amount: 300, date: "2023-04-28T11:20:15", status: "completed" },
            { id: 105, type: "withdrawal", amount: 150, date: "2023-05-10T14:35:40", status: "completed" },
            { id: 115, type: "deposit", amount: 500, date: "2023-05-15T09:30:25", status: "completed" },
            { id: 116, type: "withdrawal", amount: 200, date: "2023-05-22T15:40:10", status: "completed" },
            { id: 117, type: "deposit", amount: 350, date: "2023-05-28T12:20:35", status: "completed" },
            { id: 118, type: "deposit", amount: 200, date: "2023-06-05T10:15:40", status: "completed" }
          ],
          bettingActivity: [
            { id: 203, event: "Djokovic vs Nadal", selection: "Nadal", amount: 75, result: "win", date: "2023-05-15T15:00:00" }
          ]
        },
        {
          id: 3,
          username: "sports_fan42",
          email: "sports_fan42@example.com",
          fullName: "Michael Johnson",
          status: "pending",
          role: "user",
          joinDate: "2023-05-01",
          lastLogin: "2023-05-18T17:45:30",
          verificationStatus: "pending",
          totalBets: 9,
          winRate: 44,
          accountBalance: 320.25,
          transactions: [
            { id: 106, type: "deposit", amount: 200, date: "2023-05-01T08:50:12", status: "completed" },
            { id: 107, type: "deposit", amount: 150, date: "2023-05-10T13:40:22", status: "completed" },
            { id: 119, type: "withdrawal", amount: 50, date: "2023-05-15T16:25:30", status: "completed" },
            { id: 120, type: "deposit", amount: 100, date: "2023-05-20T09:35:45", status: "completed" },
            { id: 121, type: "withdrawal", amount: 80, date: "2023-05-25T14:15:10", status: "completed" }
          ],
          bettingActivity: [
            { id: 204, event: "Eagles vs Cowboys", selection: "Eagles", amount: 50, result: "loss", date: "2023-05-12T19:30:00" }
          ]
        },
        {
          id: 4,
          username: "big_winner",
          email: "big_winner@example.com",
          fullName: "Sarah Williams",
          status: "suspended",
          role: "user",
          joinDate: "2023-03-20",
          lastLogin: "2023-05-05T10:20:15",
          verificationStatus: "verified",
          totalBets: 64,
          winRate: 72,
          accountBalance: 0,
          transactions: [
            { id: 108, type: "deposit", amount: 1000, date: "2023-04-15T09:30:45", status: "completed" },
            { id: 109, type: "withdrawal", amount: 2500, date: "2023-05-02T16:15:30", status: "completed" },
            { id: 122, type: "deposit", amount: 1500, date: "2023-04-20T11:20:15", status: "completed" },
            { id: 123, type: "withdrawal", amount: 1000, date: "2023-04-25T15:45:30", status: "completed" },
            { id: 124, type: "deposit", amount: 2000, date: "2023-04-28T09:30:45", status: "completed" },
            { id: 125, type: "withdrawal", amount: 1000, date: "2023-05-01T14:20:10", status: "completed" }
          ],
          bettingActivity: [
            { id: 205, event: "F1 Monaco GP", selection: "Verstappen", amount: 500, result: "win", date: "2023-04-30T14:00:00" }
          ]
        },
        {
          id: 5,
          username: "new_player21",
          email: "new_player21@example.com",
          fullName: "David Brown",
          status: "active",
          role: "user",
          joinDate: "2023-05-15",
          lastLogin: "2023-05-15T14:30:00",
          verificationStatus: "unverified",
          totalBets: 0,
          winRate: 0,
          accountBalance: 100.00,
          transactions: [
            { id: 110, type: "deposit", amount: 100, date: "2023-05-15T14:25:30", status: "completed" },
            { id: 126, type: "deposit", amount: 50, date: "2023-05-20T10:15:45", status: "completed" },
            { id: 127, type: "withdrawal", amount: 30, date: "2023-05-22T16:30:10", status: "completed" },
            { id: 128, type: "deposit", amount: 80, date: "2023-05-25T09:45:30", status: "completed" },
            { id: 129, type: "withdrawal", amount: 100, date: "2023-05-28T14:10:25", status: "completed" }
          ],
          bettingActivity: []
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
      
      // Calculate user stats
      setUserStats({
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(user => user.status === 'active').length,
        pendingVerification: mockUsers.filter(user => user.verificationStatus === 'pending').length,
        suspendedUsers: mockUsers.filter(user => user.status === 'suspended').length
      });
    }, 1000);
  }, []);

  // Filter users based on search term and filters
  useEffect(() => {
    let results = users;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      results = results.filter(user => user.status === statusFilter);
    }
    
    // Filter by role
    if (roleFilter !== 'all') {
      results = results.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(results);
  }, [searchTerm, statusFilter, roleFilter, users]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // View user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  // Edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Close user details modal
  const closeUserDetailsModal = () => {
    setShowUserDetailsModal(false);
    setSelectedUser(null);
  };

  // Close edit user modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  // Change user status (suspend/activate)
  const handleStatusChange = (userId, newStatus) => {
    // Update the user status
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    
    // Update stats
    const activeCount = updatedUsers.filter(user => user.status === 'active').length;
    const suspendedCount = updatedUsers.filter(user => user.status === 'suspended').length;
    
    setUserStats({
      ...userStats,
      activeUsers: activeCount,
      suspendedUsers: suspendedCount
    });
    
    // Show confirmation message
    const username = users.find(user => user.id === userId).username;
    const actionText = newStatus === 'active' ? 'activated' : 'suspended';
    alert(`User ${username} has been ${actionText}.`);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  // Render status badge with appropriate styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="status-badge active">Active</span>;
      case 'pending':
        return <span className="status-badge pending">Pending</span>;
      case 'suspended':
        return <span className="status-badge suspended">Suspended</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  // Render verification status badge
  const renderVerificationBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="status-badge completed">Verified</span>;
      case 'pending':
        return <span className="status-badge pending">Pending</span>;
      case 'unverified':
        return <span className="status-badge">Unverified</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  // Render role badge
  const renderRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="category-tag crypto">Admin</span>;
      case 'premium':
        return <span className="category-tag politics">Premium</span>;
      case 'user':
        return <span className="category-tag sports">User</span>;
      default:
        return <span className="category-tag">{role}</span>;
    }
  };

  // Render action buttons
  const renderActionButtons = (user) => {
    return (
      <div className="actions-cell">
        <button 
          className="action-btn view" 
          title="View User Details"
          onClick={() => handleViewUser(user)}
        >
          <FaEye />
        </button>
        <button 
          className="action-btn edit" 
          title="Edit User"
          onClick={() => handleEditUser(user)}
        >
          <FaEdit />
        </button>
        {user.status === 'active' ? (
          <button 
            className="action-btn delete" 
            title="Suspend User"
            onClick={() => handleStatusChange(user.id, 'suspended')}
          >
            <FaBan />
          </button>
        ) : (
          <button 
            className="action-btn view" 
            title="Activate User"
            onClick={() => handleStatusChange(user.id, 'active')}
          >
            <FaCheck />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>User Management</h1>
      </div>
      <p className="page-description">Manage user accounts, monitor activity, and review verification status.</p>
      
      {/* User Stats Overview */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-content">
            <span className="stat-value">{userStats.totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon events">
            <FaUser />
          </div>
          <div className="stat-content">
            <span className="stat-value">{userStats.activeUsers}</span>
            <span className="stat-label">Active Users</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <FaCheck />
          </div>
          <div className="stat-content">
            <span className="stat-value">{userStats.pendingVerification}</span>
            <span className="stat-label">Pending Verification</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaBan />
          </div>
          <div className="stat-content">
            <span className="stat-value">{userStats.suspendedUsers}</span>
            <span className="stat-label">Suspended Users</span>
          </div>
        </div>
      </div>
      
      {/* User Controls */}
      <div className="controls-container">
        <div className="search-and-filters">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="search-icon" />
          </div>
          
          <div className="filters">
            <div className="filter-group">
              <label><FaFilter /> Status:</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label><FaUserShield /> Role:</label>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="premium">Premium</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="data-table-container">
        {loading ? (
          <div className="loading-interface">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading user data...</div>
            <div className="loading-info">Please wait while we fetch the latest user information</div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center'}}>No users found matching your criteria.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-name">{user.fullName}</div>
                        <div className="user-detail">@{user.username}</div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{renderRoleBadge(user.role)}</td>
                    <td>{renderStatusBadge(user.status)}</td>
                    <td>{formatDate(user.joinDate)}</td>
                    <td>{formatDateTime(user.lastLogin)}</td>
                    <td>{renderActionButtons(user)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content user-details-modal">
            <div className="modal-header">
              <h2>User Details: {selectedUser.username}</h2>
              <button className="close-modal-btn" onClick={closeUserDetailsModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details-container">
                {/* Profile Information Section */}
                <div className="user-profile-section">
                  <h3>Profile Information</h3>
                  <div className="profile-details">
                    <div className="profile-item">
                      <span className="profile-label">Full Name:</span>
                      <span className="profile-value">{selectedUser.fullName}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Username:</span>
                      <span className="profile-value">@{selectedUser.username}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Email:</span>
                      <span className="profile-value">{selectedUser.email}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Role:</span>
                      <span className="profile-value">{renderRoleBadge(selectedUser.role)}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Status:</span>
                      <span className="profile-value">{renderStatusBadge(selectedUser.status)}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Verification:</span>
                      <span className="profile-value">{renderVerificationBadge(selectedUser.verificationStatus)}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Join Date:</span>
                      <span className="profile-value">{formatDate(selectedUser.joinDate)}</span>
                    </div>
                    <div className="profile-item">
                      <span className="profile-label">Last Login:</span>
                      <span className="profile-value">{formatDateTime(selectedUser.lastLogin)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Account Activity Section */}
                <div className="user-activity-section">
                  <h3>Account Activity</h3>
                  <div className="activity-stats">
                    <div className="activity-stat-item" >
                      <span className="activity-stat-value">${selectedUser.accountBalance.toFixed(2)}</span>
                      <span className="activity-stat-label">Account Balance</span>
                    </div>
                    <div className="activity-stat-item">
                      <span className="activity-stat-value">{selectedUser.totalBets}</span>
                      <span className="activity-stat-label">Total Bets</span>
                    </div>
                    <div className="activity-stat-item">
                      <span className="activity-stat-value">{selectedUser.winRate}%</span>
                      <span className="activity-stat-label">Win Rate</span>
                    </div>
                  </div>
                </div>
                
                {/* Recent Transactions Section */}
                <div className="user-transactions-section">
                  <h3>Recent Transactions</h3>
                  {selectedUser.transactions.length === 0 ? (
                    <p className="no-data-message">No transactions found for this user.</p>
                  ) : (
                    <div className="transactions-table-container">
                      <table className="transactions-table">
                        <thead>
                          <tr>
                            <th>TYPE</th>
                            <th>AMOUNT</th>
                            <th>DATE</th>
                            <th>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.transactions.map(transaction => (
                            <tr key={transaction.id}>
                              <td>
                                <span className={`transaction-type ${transaction.type}`}>
                                  {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                                </span>
                              </td>
                              <td>
                                <span className={`amount ${transaction.type === 'deposit' ? 'positive' : 'negative'}`}>
                                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                </span>
                              </td>
                              <td>
                                {formatDateTime(transaction.date)}
                              </td>
                              <td>
                                <span className="status-badge completed">Completed</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                
                {/* User Actions Button Group */}
                <div className="user-actions">
                  <button className="action-button edit-user" onClick={() => { closeUserDetailsModal(); handleEditUser(selectedUser); }}>
                    <FaEdit /> Edit User
                  </button>
                  <button className="action-button email-user">
                    <FaEnvelope /> Contact User
                  </button>
                  {selectedUser.status === 'active' ? (
                    <button className="action-button suspend-user" onClick={() => { closeUserDetailsModal(); handleStatusChange(selectedUser.id, 'suspended'); }}>
                      <FaBan /> Suspend User
                    </button>
                  ) : (
                    <button className="action-button activate-user" onClick={() => { closeUserDetailsModal(); handleStatusChange(selectedUser.id, 'active'); }}>
                      <FaCheck /> Activate User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - Can be implemented similarly to detail modal with form inputs */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit User: {selectedUser.username}</h2>
              <button className="close-modal-btn" onClick={closeEditModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="event-form">
                <div className="form-section">
                  <h3>User Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="userFullName">Full Name</label>
                      <input
                        type="text"
                        id="userFullName"
                        name="fullName"
                        defaultValue={selectedUser.fullName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="userEmail">Email</label>
                      <input
                        type="email"
                        id="userEmail"
                        name="email"
                        defaultValue={selectedUser.email}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="userStatus">Status</label>
                      <select
                        id="userStatus"
                        name="status"
                        defaultValue={selectedUser.status}
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="userRole">Role</label>
                      <select
                        id="userRole"
                        name="role"
                        defaultValue={selectedUser.role}
                      >
                        <option value="user">User</option>
                        <option value="premium">Premium</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="verificationStatus">Verification Status</label>
                      <select
                        id="verificationStatus"
                        name="verificationStatus"
                        defaultValue={selectedUser.verificationStatus}
                      >
                        <option value="unverified">Unverified</option>
                        <option value="pending">Pending Verification</option>
                        <option value="verified">Verified</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>Account Settings</h3>
                  <div className="form-group">
                    <label htmlFor="resetPassword">Reset Password</label>
                    <div className="reset-password-container">
                      <button className="reset-password-btn">
                        <FaLock /> Generate New Password
                      </button>
                      <span className="help-text">This will generate a new password and send it to the user's email.</span>
                    </div>
                  </div>
                  
                  <div className="form-row checkboxes">
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        id="emailVerified"
                        name="emailVerified"
                        defaultChecked={selectedUser.verificationStatus === 'verified'}
                      />
                      <label htmlFor="emailVerified">Email Verified</label>
                    </div>
                    
                    <div className="form-group checkbox">
                      <input
                        type="checkbox"
                        id="allowWithdrawals"
                        name="allowWithdrawals"
                        defaultChecked={selectedUser.status === 'active'}
                      />
                      <label htmlFor="allowWithdrawals">Allow Withdrawals</label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="cancel-btn" onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button className="submit-btn">
                    <FaCheck /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
