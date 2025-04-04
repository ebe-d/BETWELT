const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  updateEventResult,
  toggleFeatured
} = require('../controllers/eventController');
const { adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin-only routes - TEMPORARILY DISABLING ADMIN CHECK FOR DEVELOPMENT
// In production, uncomment the adminOnly middleware
router.post('/', createEvent); // removed ...adminOnly for dev
router.put('/:id', updateEvent); // removed ...adminOnly for dev
router.delete('/:id', deleteEvent); // removed ...adminOnly for dev
router.put('/:id/result', updateEventResult); // removed ...adminOnly for dev
router.put('/:id/featured', toggleFeatured); // removed ...adminOnly for dev

module.exports = router; 