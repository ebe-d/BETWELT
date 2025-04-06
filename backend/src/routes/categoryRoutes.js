const express = require('express');
const router = express.Router();
const { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin-only routes - TEMPORARILY DISABLING ADMIN CHECK FOR DEVELOPMENT
// In production, uncomment the adminOnly middleware
router.post('/', createCategory); // removed ...adminOnly for dev
router.put('/:id', updateCategory); // removed ...adminOnly for dev
router.delete('/:id', deleteCategory); // removed ...adminOnly for dev

module.exports = router;
