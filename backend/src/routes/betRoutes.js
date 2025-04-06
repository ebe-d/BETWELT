const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { placeBet, getUserBets, getBetById } = require('../controllers/betController');

const router = express.Router();

// All bet routes require authentication
router.use(requireAuth);

// Place a bet
router.post('/place', placeBet);

// Get all user's bets
router.get('/', getUserBets);

// Get a specific bet by ID
router.get('/:id', getBetById);

module.exports = router;
