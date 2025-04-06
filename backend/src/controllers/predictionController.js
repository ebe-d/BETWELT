const Prediction = require('../models/Prediction');
const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Create a new prediction
 * @route   POST /api/predictions
 * @access  Public (in a real app, this would be protected)
 */
const createPrediction = asyncHandler(async (req, res) => {
  const { eventId, userId, option, amount, odds } = req.body;

  // Validate input
  if (!eventId || !userId || !option || !amount || !odds) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Calculate potential winnings
  const potentialWinnings = amount * odds;

  // Create prediction
  const prediction = await Prediction.create({
    eventId,
    userId,
    option,
    amount,
    odds,
    potentialWinnings,
    status: 'pending'
  });

  res.status(201).json(prediction);
});

/**
 * @desc    Get all predictions for a user
 * @route   GET /api/predictions/user/:userId
 * @access  Public (in a real app, this would be protected)
 */
const getUserPredictions = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const predictions = await Prediction.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json(predictions);
});

/**
 * @desc    Get all predictions for an event
 * @route   GET /api/predictions/event/:eventId
 * @access  Public (in a real app, this would be protected)
 */
const getEventPredictions = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const predictions = await Prediction.find({ eventId });
  res.status(200).json(predictions);
});

/**
 * @desc    Check if a user has already predicted on an event
 * @route   GET /api/predictions/check/:eventId/:userId
 * @access  Public (in a real app, this would be protected)
 */
const checkUserPrediction = asyncHandler(async (req, res) => {
  const { eventId, userId } = req.params;

  const prediction = await Prediction.findOne({ eventId, userId });
  
  if (prediction) {
    res.status(200).json({ 
      hasPredicted: true, 
      prediction 
    });
  } else {
    res.status(200).json({ 
      hasPredicted: false 
    });
  }
});

/**
 * @desc    Update prediction status
 * @route   PUT /api/predictions/:id
 * @access  Private/Admin
 */
const updatePredictionStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['pending', 'won', 'lost'].includes(status)) {
    res.status(400);
    throw new Error('Please provide a valid status');
  }

  const prediction = await Prediction.findById(req.params.id);

  if (!prediction) {
    res.status(404);
    throw new Error('Prediction not found');
  }

  prediction.status = status;
  await prediction.save();

  res.status(200).json(prediction);
});

/**
 * @desc    Get user performance analytics
 * @route   GET /api/predictions/analytics/:userId
 * @access  Public (in a real app, this would be protected)
 */
const getUserPerformanceAnalytics = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get all user predictions
  const predictions = await Prediction.find({ userId }).populate('eventId');
  
  if (!predictions || predictions.length === 0) {
    return res.status(200).json({
      totalBets: 0,
      winRate: 0,
      avgOdds: 0,
      bestCategory: null,
      bestCategoryWinRate: 0,
      profitLossRatio: 0,
      netProfit: 0,
      monthlySummary: [],
      categorySummary: []
    });
  }

  // Calculate basic metrics
  const totalBets = predictions.length;
  const wonPredictions = predictions.filter(p => p.status === 'won');
  const winRate = Math.round((wonPredictions.length / totalBets) * 100);
  const avgOdds = parseFloat((predictions.reduce((sum, p) => sum + p.odds, 0) / totalBets).toFixed(2));
  
  // Calculate net profit
  const netProfit = predictions.reduce((sum, p) => {
    if (p.status === 'won') {
      return sum + (p.potentialWinnings - p.amount);
    } else if (p.status === 'lost') {
      return sum - p.amount;
    }
    return sum;
  }, 0);

  // Group predictions by category
  const categoriesMap = new Map();
  
  predictions.forEach(prediction => {
    const category = prediction.eventId?.category || 'Unknown';
    
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, {
        totalBets: 0,
        wonBets: 0,
        netProfit: 0
      });
    }
    
    const categoryData = categoriesMap.get(category);
    categoryData.totalBets += 1;
    
    if (prediction.status === 'won') {
      categoryData.wonBets += 1;
      categoryData.netProfit += (prediction.potentialWinnings - prediction.amount);
    } else if (prediction.status === 'lost') {
      categoryData.netProfit -= prediction.amount;
    }
  });
  
  // Find best category
  let bestCategory = null;
  let bestCategoryWinRate = 0;
  
  const categorySummary = [];
  categoriesMap.forEach((data, category) => {
    const winRate = data.totalBets > 0 ? Math.round((data.wonBets / data.totalBets) * 100) : 0;
    
    categorySummary.push({
      category,
      winRate,
      totalBets: data.totalBets,
      netProfit: Math.round(data.netProfit)
    });
    
    if (winRate > bestCategoryWinRate && data.totalBets >= 3) {
      bestCategoryWinRate = winRate;
      bestCategory = category;
    }
  });
  
  // Calculate monthly summary
  const monthlyMap = new Map();
  
  predictions.forEach(prediction => {
    const date = new Date(prediction.createdAt);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
    
    if (!monthlyMap.has(monthYear)) {
      monthlyMap.set(monthYear, {
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        wins: 0,
        losses: 0,
        profit: 0
      });
    }
    
    const monthData = monthlyMap.get(monthYear);
    
    if (prediction.status === 'won') {
      monthData.wins += 1;
      monthData.profit += (prediction.potentialWinnings - prediction.amount);
    } else if (prediction.status === 'lost') {
      monthData.losses += 1;
      monthData.profit -= prediction.amount;
    }
  });
  
  // Convert monthly map to array and sort by date
  const monthlySummary = Array.from(monthlyMap.values())
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return new Date(Date.parse(`${a.month} 1, 2000`)) - new Date(Date.parse(`${b.month} 1, 2000`));
    })
    .map(data => ({
      month: data.month,
      wins: data.wins,
      losses: data.losses,
      profit: Math.round(data.profit)
    }));
  
  // Calculate profit/loss ratio
  const profitLossRatio = predictions.filter(p => p.status === 'lost').length > 0 ?
    parseFloat((wonPredictions.length / predictions.filter(p => p.status === 'lost').length).toFixed(1)) : 
    wonPredictions.length;
  
  res.status(200).json({
    totalBets,
    winRate,
    avgOdds,
    bestCategory,
    bestCategoryWinRate,
    profitLossRatio,
    netProfit: Math.round(netProfit),
    monthlySummary,
    categorySummary
  });
});

module.exports = {
  createPrediction,
  getUserPredictions,
  getEventPredictions,
  checkUserPrediction,
  updatePredictionStatus,
  getUserPerformanceAnalytics
};
