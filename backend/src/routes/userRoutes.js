const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();
const { registerUser, getUserProfile, getUserWallet, updateUserWallet } = require('../controllers/userController');
const isAdmin = require('../middleware/checkAdmin');

router.post('/register', registerUser);

// For the /checkadmin route, use isAdmin as a controller, not middleware
router.get('/checkadmin', requireAuth, (req, res) => {
  isAdmin(req, res);
});

router.get('/profile', requireAuth, getUserProfile);

// Wallet routes
router.get('/:userId/wallet', getUserWallet);
router.put('/:userId/wallet', updateUserWallet);

module.exports = router;