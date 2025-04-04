const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();
const { registerUser, getUserProfile } = require('../controllers/userController');
const isAdmin = require('../middleware/checkAdmin');

router.post('/register', requireAuth, registerUser);

// For the /checkadmin route, use isAdmin as a controller, not middleware
router.get('/checkadmin', requireAuth, (req, res) => {
  isAdmin(req, res);
});

router.get('/profile', requireAuth, getUserProfile);

module.exports = router;