const express = require('express');
const router = express.Router();
const { 
  createPrediction,
  getUserPredictions,
  getEventPredictions,
  checkUserPrediction,
  updatePredictionStatus,
  getUserPerformanceAnalytics
} = require('../controllers/predictionController');
const { adminOnly } = require('../middleware/auth');

// Public routes (in a real app, some of these would be protected)
router.post('/', createPrediction);
router.get('/user/:userId', getUserPredictions);
router.get('/event/:eventId', getEventPredictions);
router.get('/check/:eventId/:userId', checkUserPrediction);
router.get('/analytics/:userId', getUserPerformanceAnalytics);

// Admin-only routes - TEMPORARILY DISABLING ADMIN CHECK FOR DEVELOPMENT
// In production, uncomment the adminOnly middleware
router.put('/:id', updatePredictionStatus); // removed ...adminOnly for dev

module.exports = router;
