const Bet = require('../models/Bet');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Place a new bet
// @route   POST /api/bets/place
// @access  Private
const placeBet = asyncHandler(async (req, res) => {
  const { eventId, selection, odds, amount, potentialPayout } = req.body;
  const userId = req.auth.userId;

  if (!eventId || !selection || !odds || !amount) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    // Check if user exists
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    // Check if user has enough balance (if we have wallet functionality)
    // For now, just create the bet
    
    const bet = await Bet.create({
      userId: user._id,
      eventId,
      selection,
      odds,
      amount,
      potentialPayout,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: bet
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Error placing bet');
  }
});

// @desc    Get user's bets
// @route   GET /api/bets
// @access  Private
const getUserBets = asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  
  try {
    // Check if user exists
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    const bets = await Bet.find({ userId: user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bets.length,
      data: bets
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Error retrieving bets');
  }
});

// @desc    Get a single bet by ID
// @route   GET /api/bets/:id
// @access  Private
const getBetById = asyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  const betId = req.params.id;
  
  try {
    // Check if user exists
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    const bet = await Bet.findOne({ _id: betId, userId: user._id });
    
    if (!bet) {
      res.status(404);
      throw new Error('Bet not found');
    }
    
    res.status(200).json({
      success: true,
      data: bet
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Error retrieving bet');
  }
});

module.exports = {
  placeBet,
  getUserBets,
  getBetById
};
