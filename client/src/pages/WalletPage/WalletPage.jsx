import React, { useState, useEffect } from 'react';
import { FaWallet, FaArrowUp, FaArrowDown, FaExchangeAlt, FaGift, FaTimes, 
  FaCreditCard, FaPaypal, FaBitcoin, FaEthereum, FaApple, FaGooglePay, FaUserFriends, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from "@/components/NavBar/navbar";
import styles from './wallet.module.css';
import { useUser } from '../../context/UserContext';

const WalletPage = () => {
  // States
  const [theme, setTheme] = useState('dark');
  const [allTransactions, setAllTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [modalType, setModalType] = useState('');
  
  // Get user data from context
  const { userData } = useUser();
  const { wallet } = userData;
  
  // Mock data for transactions history
  const transactionsData = [
    {
      id: 1,
      type: 'deposit',
      amount: 500,
      date: '2023-06-18T14:30:00',
      status: 'completed',
      description: 'Deposit via Credit Card'
    },
    {
      id: 2,
      type: 'withdrawal',
      amount: 200,
      date: '2023-06-15T09:45:00',
      status: 'completed',
      description: 'Withdrawal to Bank Account'
    },
    {
      id: 3,
      type: 'transfer',
      amount: 50,
      date: '2023-06-12T18:20:00',
      status: 'completed',
      description: 'Transfer to @JackD'
    },
    {
      id: 4,
      type: 'reward',
      amount: 25,
      date: '2023-06-10T11:15:00',
      status: 'completed',
      description: 'Referral Bonus'
    },
    {
      id: 5,
      type: 'deposit',
      amount: 300,
      date: '2023-06-05T16:50:00',
      status: 'completed',
      description: 'Deposit via PayPal'
    },
    {
      id: 6,
      type: 'withdrawal',
      amount: 150,
      date: '2023-06-01T10:30:00',
      status: 'pending',
      description: 'Withdrawal to Bank Account'
    },
    {
      id: 7,
      type: 'deposit',
      amount: 250,
      date: '2023-05-28T13:15:00',
      status: 'completed',
      description: 'Deposit via Bitcoin'
    },
    {
      id: 8,
      type: 'reward',
      amount: 35,
      date: '2023-05-25T10:40:00',
      status: 'completed',
      description: 'Event participation bonus'
    },
    {
      id: 9,
      type: 'transfer',
      amount: 75,
      date: '2023-05-22T19:30:00',
      status: 'completed',
      description: 'Transfer to @MikeR'
    }
  ];
  
  // Mock data for rewards
  const rewardsData = [
    {
      id: 1,
      type: 'referral',
      amount: 30,
      description: 'Referral bonus for inviting @SarahJ',
      date: '2023-06-15T09:45:00',
      claimable: false
    },
    {
      id: 2,
      type: 'cashback',
      amount: 15.75,
      description: '5% cashback on your recent bet',
      date: '2023-06-10T14:20:00',
      claimable: true
    },
    {
      id: 3,
      type: 'eventReward',
      amount: 50,
      description: 'Special reward for World Cup promo',
      date: '2023-06-05T16:50:00',
      claimable: true
    }
  ];
  
  // Mock payment methods
  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: <FaCreditCard /> },
    { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
    { id: 'bitcoin', name: 'Bitcoin', icon: <FaBitcoin /> },
    { id: 'ethereum', name: 'Ethereum', icon: <FaEthereum /> },
    { id: 'apple-pay', name: 'Apple Pay', icon: <FaApple /> },
    { id: 'google-pay', name: 'Google Pay', icon: <FaGooglePay /> }
  ];
  
  // Load data when component mounts
  useEffect(() => {
    // Set theme based on localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Listen for theme changes
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };
    
    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('themeChanged', handleThemeChange);
    
    // Set initial transactions and rewards
    setAllTransactions(transactionsData);
    setRewards(rewardsData);
    
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);
  
  // Filter transactions based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setAllTransactions(transactionsData);
    } else {
      setAllTransactions(transactionsData.filter(transaction => transaction.type === activeFilter));
    }
  }, [activeFilter]);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }) + ', ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Handle buy PDX button click
  const handleBuyPDX = () => {
    setModalType('buy');
    setShowPaymentModal(true);
  };
  
  // Handle withdraw PDX button click
  const handleWithdrawPDX = () => {
    setModalType('withdraw');
    setShowPaymentModal(true);
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod(null);
  };
  
  // Handle confirm payment method
  const handleConfirmPayment = () => {
    // In a real app, this would process the payment
    alert(`${modalType === 'buy' ? 'Purchase' : 'Withdrawal'} with ${selectedPaymentMethod} would be processed here`);
    handleCloseModal();
  };
  
  // Handle claim reward
  const handleClaimReward = (rewardId) => {
    // In a real app, this would process the reward claim
    alert(`Claim reward ${rewardId} would be processed here`);
    
    // Update rewards list to show claimed
    const updatedRewards = rewards.map(reward =>
      reward.id === rewardId ? { ...reward, claimable: false } : reward
    );
    setRewards(updatedRewards);
  };

  // Handle contact developer
  const handleContactDev = () => {
    window.open('mailto:ebenezerdsouza27@gmail.com', '_blank');
  };
  
  // Render transaction icon based on type
  const renderTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return (
          <div className={`${styles.transactionIcon} ${styles.deposit}`}>
            <FaArrowDown />
          </div>
        );
      case 'withdrawal':
        return (
          <div className={`${styles.transactionIcon} ${styles.withdrawal}`}>
            <FaArrowUp />
          </div>
        );
      case 'transfer':
        return (
          <div className={`${styles.transactionIcon} ${styles.transfer}`}>
            <FaExchangeAlt />
          </div>
        );
      case 'reward':
        return (
          <div className={`${styles.transactionIcon} ${styles.reward}`}>
            <FaGift />
          </div>
        );
      default:
        return (
          <div className={styles.transactionIcon}>
            <FaWallet />
          </div>
        );
    }
  };
  
  // Render reward icon based on type
  const renderRewardIcon = (type) => {
    switch (type) {
      case 'referral':
        return (
          <div className={`${styles.rewardIcon} ${styles.referral}`}>
            <FaUserFriends />
          </div>
        );
      case 'cashback':
        return (
          <div className={`${styles.rewardIcon} ${styles.cashback}`}>
            <FaArrowDown />
          </div>
        );
      case 'eventReward':
        return (
          <div className={`${styles.rewardIcon} ${styles.eventReward}`}>
            <FaGift />
          </div>
        );
      default:
        return (
          <div className={styles.rewardIcon}>
            <FaGift />
          </div>
        );
    }
  };
  
  return (
    <>
      <Navbar />
      <div className={styles.walletContainer} data-theme={theme}>
        <div className={styles.walletContent}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>My Wallet</h1>
            <p className={styles.pageDescription}>
              Manage your PDX tokens, view transactions, and transfer funds. 
              Easily deposit or withdraw tokens using your preferred payment method.
            </p>
          </div>
          
          {/* Wallet Overview */}
          <div className={styles.overviewContainer}>
            <div className={styles.overviewHeader}>
              <h2 className={styles.overviewTitle}>Balance Overview</h2>
              <div className={styles.pdxLogo}>
                <FaWallet />
                PDX Tokens
              </div>
            </div>
            
            <div className={styles.balanceCards}>
              <div className={styles.balanceCard}>
                <div className={styles.balanceLabel}>Total Balance</div>
                <div className={styles.balanceAmount}>
                  {wallet.totalBalance.toFixed(2)}
                  <span className={styles.tokenSymbol}>PDX</span>
                </div>
                <div className={styles.balanceSubtext}>Available for betting & withdrawals</div>
              </div>
              
              <div className={styles.balanceCard}>
                <div className={styles.balanceLabel}>Pending PDX</div>
                <div className={styles.balanceAmount}>
                  {wallet.pendingBalance.toFixed(2)}
                  <span className={styles.tokenSymbol}>PDX</span>
                </div>
                <div className={styles.balanceSubtext}>Awaiting settlement from active bets</div>
              </div>
              
              <div className={styles.balanceCard}>
                <div className={styles.balanceLabel}>Earned from Rewards</div>
                <div className={styles.balanceAmount}>
                  {wallet.earnedRewards.toFixed(2)}
                  <span className={styles.tokenSymbol}>PDX</span>
                </div>
                <div className={styles.balanceSubtext}>From referrals, cashback & promotions</div>
              </div>
            </div>
            
            <div className={styles.actionButtons}>
              <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={handleBuyPDX}>
                <FaArrowDown />
                Buy PDX
              </button>
              <button className={styles.actionButton} onClick={handleWithdrawPDX}>
                <FaArrowUp />
                Withdraw PDX
              </button>
              <Link to="/home/rewards" className={`${styles.actionButton} ${styles.rewardsButton}`}>
                <FaGift />
                View Rewards
              </Link>
            </div>
          </div>
          
          {/* Main Content */}
          <div className={styles.walletGrid}>
            {/* Transactions Section */}
            <div className={styles.transactionsContainer}>
              <div className={styles.transactionsHeader}>
                <h3 className={styles.transactionsTitle}>Transaction History</h3>
                <div className={styles.filterOptions}>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'deposit' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('deposit')}
                  >
                    Deposits
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'withdrawal' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('withdrawal')}
                  >
                    Withdrawals
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'transfer' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('transfer')}
                  >
                    Transfers
                  </button>
                  <button 
                    className={`${styles.filterButton} ${activeFilter === 'reward' ? styles.active : ''}`}
                    onClick={() => setActiveFilter('reward')}
                  >
                    Rewards
                  </button>
                </div>
              </div>
              
              <div className={styles.transactionsList}>
                {allTransactions.length > 0 ? (
                  allTransactions.map(transaction => (
                    <div key={transaction.id} className={styles.transactionItem}>
                      <div className={styles.transactionInfo}>
                        {renderTransactionIcon(transaction.type)}
                        <div className={styles.transactionDetails}>
                          <div className={styles.transactionType}>{transaction.description}</div>
                          <div className={styles.transactionDate}>{formatDate(transaction.date)}</div>
                        </div>
                      </div>
                      <div>
                        <div className={`${styles.transactionAmount} ${
                          transaction.type === 'deposit' || transaction.type === 'reward' 
                            ? styles.positive 
                            : styles.negative
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'reward' ? '+' : '-'}
                          {transaction.amount.toFixed(2)} PDX
                        </div>
                        <div className={`${styles.transactionStatus} ${styles[transaction.status]}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>No transactions found</div>
                )}
              </div>
            </div>
            
            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* P2P Transfer Section */}
              <div className={styles.transferContainer}>
                <div className={styles.transferHeader}>
                  <h3 className={styles.transferTitle}>Transfer PDX</h3>
                </div>
                <div className={styles.transferForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="recipientUsername" className={styles.formLabel}>
                      Recipient Username
                    </label>
                    <input 
                      type="text" 
                      id="recipientUsername" 
                      className={styles.formInput} 
                      placeholder="Enter username or ID"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="transferAmount" className={styles.formLabel}>
                      Amount (PDX)
                    </label>
                    <input 
                      type="number" 
                      id="transferAmount" 
                      className={styles.formInput} 
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="transferNote" className={styles.formLabel}>
                      Note (optional)
                    </label>
                    <input 
                      type="text" 
                      id="transferNote" 
                      className={styles.formInput} 
                      placeholder="Add a message"
                    />
                  </div>
                  
                  <button className={styles.transferButton}>
                    Send PDX
                  </button>
                </div>
              </div>
              
              {/* Rewards Section */}
              <div className={styles.rewardsContainer}>
                <div className={styles.rewardsHeader}>
                  <h3 className={styles.rewardsTitle}>Earnings & Bonuses</h3>
                </div>
                <div className={styles.rewardsList}>
                  {rewards.map(reward => (
                    <div key={reward.id} className={styles.rewardItem}>
                      {renderRewardIcon(reward.type)}
                      <div className={styles.rewardDetails}>
                        <div className={styles.rewardType}>
                          {reward.type === 'referral' 
                            ? 'Referral Bonus' 
                            : reward.type === 'cashback' 
                              ? 'Cashback Reward' 
                              : 'Event Bonus'}
                        </div>
                        <div className={styles.rewardDescription}>{reward.description}</div>
                      </div>
                      <div>
                        <div className={styles.rewardAmount}>
                          +{reward.amount.toFixed(2)} PDX
                        </div>
                        {reward.claimable && (
                          <div 
                            className={styles.rewardClaim}
                            onClick={() => handleClaimReward(reward.id)}
                          >
                            Claim Now
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Method Modal */}
          {showPaymentModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}>
                    {modalType === 'buy' ? 'Buy PDX Tokens' : 'Withdraw PDX Tokens'}
                  </h3>
                  <button className={styles.closeButton} onClick={handleCloseModal}>
                    <FaTimes />
                  </button>
                </div>
                <div className={styles.modalBody}>
                  {modalType === 'buy' && (
                    <div className={styles.notificationBox}>
                      <p className={styles.notificationText}>
                        PDX token purchases are currently unavailable. Please contact the developer to request more tokens for testing purposes.
                      </p>
                      <button 
                        className={`${styles.actionButton} ${styles.primaryButton} ${styles.contactButton}`}
                        onClick={handleContactDev}
                      >
                        <FaEnvelope />
                        Contact Developer
                      </button>
                    </div>
                  )}
                  
                  {modalType === 'withdraw' && (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          Select Withdrawal Method
                        </label>
                        <div className={styles.paymentOptionsList}>
                          {paymentMethods.map(method => (
                            <div 
                              key={method.id}
                              className={`${styles.paymentOption} ${
                                selectedPaymentMethod === method.id ? styles.selected : ''
                              }`}
                              onClick={() => handlePaymentMethodSelect(method.id)}
                            >
                              <div className={styles.paymentIcon}>
                                {method.icon}
                              </div>
                              <div className={styles.paymentName}>
                                {method.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="modalAmount" className={styles.formLabel}>
                          Amount (PDX)
                        </label>
                        <input 
                          type="number" 
                          id="modalAmount" 
                          className={styles.formInput} 
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.modalFooter}>
                  <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={handleCloseModal}>
                    Cancel
                  </button>
                  {modalType === 'withdraw' && (
                    <button 
                      className={`${styles.modalButton} ${styles.confirmButton}`} 
                      onClick={handleConfirmPayment}
                      disabled={!selectedPaymentMethod}
                    >
                      Withdraw PDX
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WalletPage; 