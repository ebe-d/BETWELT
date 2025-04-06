import React, { useState, useEffect } from 'react';
import styles from './communitypage.module.css';
import { 
  FaComments, 
  FaNewspaper, 
  FaChartBar, 
  FaRegThumbsUp, 
  FaRegComment, 
  FaShare,
  FaCalendarAlt,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaLongArrowAltRight,
  FaUsers,
  FaClock,
  FaPlus,
  FaPoll,
  FaExclamationCircle
} from 'react-icons/fa';

const CommunityPage = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeTab, setActiveTab] = useState('discussions');
  const [posts, setPosts] = useState([]);
  const [newsDummyData, setNewsDummyData] = useState([]);
  const [pollsDummyData, setPollsDummyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    discussions: true,
    news: true,
    polls: true
  });

  // Monitor theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };

    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  // Fetch discussions dummy data
  useEffect(() => {
    // Simulate an API call
    setTimeout(() => {
      const dummyPosts = [
        {
          id: 1,
          author: "SportsFan23",
          avatar: null,
          time: '2 hours ago',
          title: "What do you think about the upcoming Champions League final?",
          content: "I believe Real Madrid has a great chance of winning due to their experience in finals, but Manchester City has been in exceptional form all season. What are your predictions?",
          likes: 24,
          comments: [
            { 
              id: 1,
              author: 'SoccerFan', 
              content: 'City will win 2-1, they have too much quality in attack.',
              time: '1 hour ago'
            },
            { 
              id: 2,
              author: 'MadridSupporter', 
              content: 'Never bet against Real in a final. 3-2 to Madrid after extra time!',
              time: '45 mins ago'
            }
          ]
        },
        {
          id: 2,
          author: "BasketballGuru",
          avatar: null,
          time: '5 hours ago',
          title: "NBA Playoffs discussion thread",
          content: "Let's talk about the current playoff matchups. Who do you think will make it to the finals this year?",
          likes: 18,
          comments: [
            { 
              id: 1,
              author: 'BasketballFan', 
              content: 'Celtics look unstoppable this year.',
              time: '4 hours ago'
            }
          ]
        },
        {
          id: 3,
          author: "TennisAce",
          avatar: null,
          time: '1 day ago',
          title: "Wimbledon 2023 predictions",
          content: "With Wimbledon approaching, who are your favorites for the men's and women's titles this year?",
          likes: 35,
          comments: []
        }
      ];
      
      setPosts(dummyPosts);
      setLoading(false);
    }, 1000);
  }, []);

  // Fetch news dummy data
  useEffect(() => {
    setTimeout(() => {
      const newsData = [
        {
          id: 1,
          title: 'UEFA Champions League Final Set: Real Madrid vs Manchester City',
          excerpt: 'The stage is set for an epic clash as Real Madrid and Manchester City will battle for European supremacy.',
          category: 'Football',
          image: 'https://via.placeholder.com/300x180',
          date: 'May 15, 2023'
        },
        {
          id: 2,
          title: 'Unexpected Upsets in the NBA Playoffs Second Round',
          excerpt: 'Several top seeds have been eliminated as underdogs continue to shine in this year\'s NBA playoffs.',
          category: 'Basketball',
          image: 'https://via.placeholder.com/300x180',
          date: 'May 12, 2023'
        },
        {
          id: 3,
          title: 'Tennis Star Returns from Injury for French Open',
          excerpt: 'After months of rehabilitation, the former champion announces comeback for the clay court Grand Slam.',
          category: 'Tennis',
          image: 'https://via.placeholder.com/300x180',
          date: 'May 10, 2023'
        },
        {
          id: 4,
          title: 'Formula 1: Dramatic Last Lap Overtake Decides Monaco Grand Prix',
          excerpt: 'In one of the most thrilling Monaco races in years, a bold strategy and brilliant driving led to a spectacular finish.',
          category: 'F1 Racing',
          image: 'https://via.placeholder.com/300x180',
          date: 'May 8, 2023'
        }
      ];
      
      setNewsDummyData(newsData);
    }, 1000);
  }, []);

  // Fetch polls dummy data
  useEffect(() => {
    setTimeout(() => {
      const pollsData = [
        {
          id: 1,
          question: 'Who will win the Champions League final?',
          options: [
            { id: 1, text: 'Real Madrid', percentage: 42 },
            { id: 2, text: 'Manchester City', percentage: 58 }
          ],
          totalVotes: 1245,
          deadline: '3 days left'
        },
        {
          id: 2,
          question: 'Which team will win the NBA Championship this season?',
          options: [
            { id: 1, text: 'Boston Celtics', percentage: 35 },
            { id: 2, text: 'Denver Nuggets', percentage: 30 },
            { id: 3, text: 'Miami Heat', percentage: 20 },
            { id: 4, text: 'Los Angeles Lakers', percentage: 15 }
          ],
          totalVotes: 879,
          deadline: '1 week left'
        },
        {
          id: 3,
          question: 'Who is the greatest tennis player of all time?',
          options: [
            { id: 1, text: 'Roger Federer', percentage: 33 },
            { id: 2, text: 'Rafael Nadal', percentage: 32 },
            { id: 3, text: 'Novak Djokovic', percentage: 30 },
            { id: 4, text: 'Someone else', percentage: 5 }
          ],
          totalVotes: 2134,
          deadline: 'Closed'
        }
      ];
      
      setPollsDummyData(pollsData);
    }, 1000);
  }, []);

  // Toggle post comments
  const toggleComments = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get first letter of author name for avatar
  const getAvatarLetter = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.communityContainer} data-theme={theme}>
        <div className={styles.communityHeader}>
          <h1 className={styles.pageTitle}>Community Hub</h1>
          <p className={styles.pageDescription}>
            Join discussions, stay updated with the latest news, and participate in community polls
          </p>
        </div>

        <div className={styles.communityTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'discussions' ? styles.active : ''}`}
            onClick={() => setActiveTab('discussions')}
          >
            <FaComments /> Discussions
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'news' ? styles.active : ''}`}
            onClick={() => setActiveTab('news')}
          >
            <FaNewspaper /> News & Updates
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'polls' ? styles.active : ''}`}
            onClick={() => setActiveTab('polls')}
          >
            <FaChartBar /> Community Polls
          </button>
        </div>

        <div className={styles.contentWrapper}>
          {activeTab === 'discussions' && (
            <div className={styles.discussionContainer}>
              <div className={styles.sectionCard}>
                <div 
                  className={`${styles.sectionHeader} ${expandedSections.discussions ? styles.expanded : ''}`}
                  onClick={() => toggleSection('discussions')}
                >
                  <h2 className={styles.sectionTitle}>Latest Discussions</h2>
                  <button className={styles.toggleButton}>
                    <span className={styles.collapseIcon}>
                      {expandedSections.discussions ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>
                </div>
                
                {expandedSections.discussions && (
                  <div className={styles.sectionContent}>
                    <div className={styles.newPostForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="postTitle">Title</label>
                        <input 
                          type="text" 
                          id="postTitle" 
                          className={styles.formInput} 
                          placeholder="Give your discussion a title" 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="postContent">Content</label>
                        <textarea 
                          id="postContent" 
                          className={styles.formInput} 
                          rows="4"
                          placeholder="Share your thoughts with the community" 
                        ></textarea>
                      </div>
                      <div className={styles.contentControls}>
                        <button className={`${styles.actionButton} ${styles.secondary}`}>Cancel</button>
                        <button className={`${styles.actionButton} ${styles.primary}`}>Post Discussion</button>
                      </div>
                    </div>
                    
                    <div className={styles.postsList}>
                      {posts.map(post => (
                        <div key={post.id} className={styles.postCard}>
                          <div className={styles.postHeader}>
                            <div className={styles.authorAvatar}>
                              {post.avatar || getAvatarLetter(post.author)}
                            </div>
                            <div className={styles.postInfo}>
                              <h4 className={styles.authorName}>{post.author}</h4>
                              <div className={styles.postTime}>{post.time}</div>
                            </div>
                          </div>
                          
                          <h3 className={styles.postTitle}>{post.title}</h3>
                          <p className={styles.postContent}>{post.content}</p>
                          
                          <div className={styles.postActions}>
                            <div className={styles.postAction}>
                              <FaRegThumbsUp /> <span>{post.likes}</span>
                            </div>
                            <div 
                              className={styles.postAction}
                              onClick={() => toggleComments(post.id)}
                            >
                              <FaRegComment /> <span>{post.comments.length}</span>
                            </div>
                            <div className={styles.postAction}>
                              <FaShare /> <span>Share</span>
                            </div>
                          </div>
                          
                          {expandedPosts[post.id] && post.comments.length > 0 && (
                            <div className={styles.commentsList}>
                              {post.comments.map(comment => (
                                <div key={comment.id} className={styles.comment}>
                                  <div className={styles.commentHeader}>
                                    <span className={styles.commentAuthor}>{comment.author}</span>
                                    <span className={styles.commentTime}>{comment.time}</span>
                                  </div>
                                  <p className={styles.commentContent}>{comment.content}</p>
                                </div>
                              ))}
                              
                              <div className={styles.addCommentForm}>
                                <input 
                                  type="text" 
                                  className={styles.commentInput} 
                                  placeholder="Add a comment..." 
                                />
                                <button className={styles.postButton}>Post</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.loadMoreContainer}>
                      <button className={styles.loadMore}>Load More Discussions</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className={styles.newsContainer}>
              <div className={styles.sectionCard}>
                <div 
                  className={`${styles.sectionHeader} ${expandedSections.news ? styles.expanded : ''}`}
                  onClick={() => toggleSection('news')}
                >
                  <h2 className={styles.sectionTitle}>Latest News & Updates</h2>
                  <button className={styles.toggleButton}>
                    <span className={styles.collapseIcon}>
                      {expandedSections.news ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>
                </div>
                
                {expandedSections.news && (
                  <div className={styles.sectionContent}>
                    {newsDummyData.length > 0 ? (
                      <div className={styles.newsGrid}>
                        {newsDummyData.map(news => (
                          <div key={news.id} className={styles.newsCard}>
                            <div className={styles.newsImage}>
                              <img src={news.image} alt={news.title} />
                              <div className={styles.newsCategory}>{news.category}</div>
                            </div>
                            <div className={styles.newsContent}>
                              <div className={styles.newsDate}>
                                <FaCalendarAlt /> {news.date}
                              </div>
                              <h3 className={styles.newsTitle}>{news.title}</h3>
                              <p className={styles.newsExcerpt}>{news.excerpt}</p>
                              <a href="#" className={styles.readMore}>
                                Read full article <FaLongArrowAltRight />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptySectionMessage}>
                        <FaExclamationCircle />
                        <h3 className={styles.emptySectionTitle}>No news available</h3>
                        <p>Check back later for the latest updates</p>
                      </div>
                    )}
                    
                    <div className={styles.loadMoreContainer}>
                      <button className={styles.loadMore}>View All News</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'polls' && (
            <div className={styles.pollsContainer}>
              <div className={styles.sectionCard}>
                <div 
                  className={`${styles.sectionHeader} ${expandedSections.polls ? styles.expanded : ''}`}
                  onClick={() => toggleSection('polls')}
                >
                  <h2 className={styles.sectionTitle}>Community Polls</h2>
                  <button className={styles.toggleButton}>
                    <span className={styles.collapseIcon}>
                      {expandedSections.polls ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>
                </div>
                
                {expandedSections.polls && (
                  <div className={styles.sectionContent}>
                    <button className={styles.createPollButton}>
                      <FaPlus /> Create New Poll
                    </button>
                    
                    {pollsDummyData.length > 0 ? (
                      <div className={styles.pollsList}>
                        {pollsDummyData.map(poll => (
                          <div key={poll.id} className={styles.pollCard}>
                            <h3 className={styles.pollQuestion}>{poll.question}</h3>
                            
                            <div className={styles.pollOptions}>
                              {poll.options.map(option => (
                                <div key={option.id} className={styles.pollOption}>
                                  <div 
                                    className={styles.optionBackground}
                                    style={{ width: `${option.percentage}%` }}
                                  ></div>
                                  <div className={styles.optionContent}>
                                    <span className={styles.optionText}>{option.text}</span>
                                    <span className={styles.optionPercentage}>{option.percentage}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className={styles.pollMeta}>
                              <div className={styles.pollVotes}>
                                <FaUsers /> {poll.totalVotes} votes
                              </div>
                              <div className={styles.pollDeadline}>
                                <FaClock /> {poll.deadline}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptySectionMessage}>
                        <FaExclamationCircle />
                        <h3 className={styles.emptySectionTitle}>No active polls</h3>
                        <p>Be the first to create a poll for the community</p>
                      </div>
                    )}
                    
                    <div className={styles.loadMoreContainer}>
                      <button className={styles.loadMore}>View All Polls</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage; 