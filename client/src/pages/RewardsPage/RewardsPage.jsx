import React, { useState, useEffect } from 'react';
import { FaCrown, FaTrophy, FaGift, FaMedal, FaCalendarCheck, FaRegClock, FaMoneyBillWave, FaPercent, FaFireAlt, FaUserFriends, FaRegCheckCircle, FaInbox, FaStar } from 'react-icons/fa';
import styles from './rewardspage.module.css';

const RewardsPage = () => {
  const [theme, setTheme] = useState('light');
  const [rewardsBalance, setRewardsBalance] = useState(1250);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [activeTab, setActiveTab] = useState('promotions');
  const [countdown, setCountdown] = useState(18000); // 5 hours in seconds
  
  // Monitor theme changes
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const time = formatTime(countdown);

  // Streak days configuration
  const streakDays = [
    { day: 1, reward: '50 points' },
    { day: 2, reward: '75 points' },
    { day: 3, reward: '100 points' },
    { day: 4, reward: '150 points' },
    { day: 5, reward: '200 points' },
    { day: 6, reward: '250 points' },
    { day: 7, reward: '500 points' },
  ];

  // Achievement data
  const achievements = [
    {
      id: 1, 
      title: 'First Prediction',
      description: 'Place your first prediction on any event',
      reward: '100 points',
      icon: <FaStar />,
      completed: true
    },
    {
      id: 2, 
      title: 'Prediction Streak',
      description: 'Make predictions on 5 consecutive days',
      reward: '250 points',
      icon: <FaFireAlt />,
      completed: false,
      progress: '3/5'
    },
    {
      id: 3, 
      title: 'Profile Completionist',
      description: 'Complete all sections of your profile',
      reward: '200 points',
      icon: <FaUserFriends />,
      completed: true
    },
    {
      id: 4, 
      title: 'Big Winner',
      description: 'Win more than 500 tokens in a single prediction',
      reward: '300 points',
      icon: <FaTrophy />,
      completed: false,
      progress: '0/1'
    },
    {
      id: 5, 
      title: 'Community Participant',
      description: 'Make your first post in the community section',
      reward: '150 points',
      icon: <FaInbox />,
      completed: false,
      progress: '0/1'
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.rewardsContainer}>
        <div className={styles.rewardsHeader}>
          <h1 className={styles.pageTitle}>Rewards & Promotions</h1>
          <p className={styles.pageDescription}>
            Earn rewards by completing achievements, logging in daily, and participating in special promotions
          </p>
        </div>

        <div className={styles.rewardsOverview}>
          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>
              <FaCrown />
            </div>
            <div className={styles.overviewContent}>
              <h3>Rewards Balance</h3>
              <p className={styles.overviewValue}>{rewardsBalance} <span>points</span></p>
            </div>
          </div>
          
          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>
              <FaCalendarCheck />
            </div>
            <div className={styles.overviewContent}>
              <h3>Daily Streak</h3>
              <p className={styles.overviewValue}>{dailyStreak} <span>days</span></p>
            </div>
          </div>
          
          <div className={styles.overviewCard}>
            <div className={styles.overviewIcon}>
              <FaMedal />
            </div>
            <div className={styles.overviewContent}>
              <h3>Achievements</h3>
              <p className={styles.overviewValue}>{achievements.filter(a => a.completed).length} <span>/ {achievements.length}</span></p>
            </div>
          </div>
        </div>

        <div className={styles.rewardsTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'daily' ? styles.active : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            <FaCalendarCheck /> Daily Rewards
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'promotions' ? styles.active : ''}`}
            onClick={() => setActiveTab('promotions')}
          >
            <FaPercent /> Promotions
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'achievements' ? styles.active : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <FaTrophy /> Achievements
          </button>
        </div>

        <div className={styles.contentWrapper}>
          {activeTab === 'daily' && (
            <div className={styles.sectionCard}>
              <div className={styles.dailyRewardsContainer}>
                <div className={styles.dailyRewardsInfo}>
                  <h2>Daily Login Rewards</h2>
                  <p>Log in every day to earn rewards and build your streak. The longer your streak, the greater the rewards!</p>
                  
                  <div className={styles.streakInfo}>
                    <div className={styles.streakLine}></div>
                    <div className={styles.streakDays}>
                      {streakDays.map((item, index) => (
                        <div className={styles.streakDay} key={index}>
                          <div className={`${styles.streakCircle} ${index < dailyStreak ? styles.active : ''}`}>
                            {item.day}
                          </div>
                          <div className={styles.streakReward}>{item.reward}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={styles.dailyClaim}>
                  <div className={styles.dailyClaimBox}>
                    <h3>Come back tomorrow for your next reward</h3>
                    
                    <div className={styles.countdownTimer}>
                      <div className={styles.countdownItem}>
                        <div className={styles.countdownValue}>{time.hours}</div>
                        <div className={styles.countdownLabel}>Hours</div>
                      </div>
                      <div className={styles.countdownSeparator}>:</div>
                      <div className={styles.countdownItem}>
                        <div className={styles.countdownValue}>{time.minutes}</div>
                        <div className={styles.countdownLabel}>Minutes</div>
                      </div>
                      <div className={styles.countdownSeparator}>:</div>
                      <div className={styles.countdownItem}>
                        <div className={styles.countdownValue}>{time.seconds}</div>
                        <div className={styles.countdownLabel}>Seconds</div>
                      </div>
                    </div>
                    
                    <button className={styles.claimButton} disabled={true}>
                      Claim Daily Reward
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'promotions' && (
            <div className={styles.promotionsSection}>
              <div className={styles.sectionCard}>
                <div className={styles.promotionHeader}>
                  <h2>Featured Promotion</h2>
                  <p>Take advantage of our latest promotions to boost your rewards and enhance your experience.</p>
                </div>
                
                <div className={styles.featuredPromotion}>
                  <div className={styles.promotionGraphic}>
                    <FaGift style={{ fontSize: '80px', color: 'var(--accent-primary)' }} />
                  </div>
                  <div className={styles.promotionContent}>
                    <h2 className={styles.promotionTitle}>Welcome Bonus Package</h2>
                    <p className={styles.promotionDescription}>
                      New to BetWelt? Get started with our welcome package! Receive bonus points on your first 5 predictions, plus daily rewards boosters and exclusive access to special events.
                    </p>
                    <div className={styles.promotionMeta}>
                      <div className={styles.promotionTimer}>
                        <FaRegClock /> Expires in 7 days
                      </div>
                      <button className={styles.claimPromoButton}>
                        Claim Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.sectionCard}>
                <div className={styles.promotionHeader}>
                  <h2>Current Promotions</h2>
                  <p>Browse all available promotions and special offers</p>
                </div>
                
                <div className={styles.promotionCards}>
                  <div className={styles.promoCard}>
                    <div className={styles.promoCardHeader}>
                      <div className={styles.promoType}>Bonus</div>
                      <div className={styles.promoExpiry}>5 days left</div>
                    </div>
                    <h3 className={styles.promoCardTitle}>
                      <span className={styles.promoHighlight}>2x</span> Points Weekend
                    </h3>
                    <p className={styles.promoCardDescription}>
                      Double points on all predictions made this weekend.
                    </p>
                    <div className={styles.promoBenefits}>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> All predictions eligible
                      </div>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> No minimum amount
                      </div>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> Valid Saturday & Sunday
                      </div>
                    </div>
                    <button className={styles.claimPromoButton}>Activate</button>
                  </div>
                  
                  <div className={styles.promoCard}>
                    <div className={styles.promoCardHeader}>
                      <div className={styles.promoType}>Referral</div>
                      <div className={styles.promoExpiry}>Ongoing</div>
                    </div>
                    <h3 className={styles.promoCardTitle}>
                      Refer a Friend
                    </h3>
                    <p className={styles.promoCardDescription}>
                      Invite friends and earn rewards when they sign up and make their first prediction.
                    </p>
                    <div className={styles.promoBenefits}>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> 200 points per referral
                      </div>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> Friend gets 100 bonus points
                      </div>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> Unlimited referrals
                      </div>
                    </div>
                    <button className={styles.claimPromoButton}>Get Referral Link</button>
                  </div>
                  
                  <div className={styles.promoCard}>
                    <div className={styles.promoCardHeader}>
                      <div className={styles.promoType}>Challenge</div>
                      <div className={styles.promoExpiry}>3 days left</div>
                    </div>
                    <h3 className={styles.promoCardTitle}>
                      Prediction Marathon
                    </h3>
                    <p className={styles.promoCardDescription}>
                      Make at least 10 predictions in the next 3 days to earn bonus rewards.
                    </p>
                    <div className={styles.promoBenefits}>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> 300 bonus points
                      </div>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> Progress: 2/10 completed
                      </div>
                      <div className={styles.promoBenefit}>
                        <FaRegCheckCircle /> Any prediction counts
                      </div>
                    </div>
                    <button className={styles.claimPromoButton}>View Events</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className={styles.sectionCard}>
              <div className={styles.achievementsContainer}>
                <h2>Achievements</h2>
                <p>Complete achievements to earn rewards and showcase your progress.</p>
                
                <div className={styles.achievementsList}>
                  {achievements.map(achievement => (
                    <div key={achievement.id} className={`${styles.achievementCard} ${achievement.completed ? styles.completed : ''}`}>
                      <div className={styles.achievementIcon}>
                        {achievement.icon}
                      </div>
                      <div className={styles.achievementInfo}>
                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>
                        <div className={styles.achievementReward}>
                          <FaMoneyBillWave /> {achievement.reward}
                        </div>
                      </div>
                      <div className={styles.achievementStatus}>
                        {achievement.completed ? 'Completed' : (achievement.progress || 'In Progress')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsPage; 