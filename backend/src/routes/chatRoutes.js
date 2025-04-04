const express = require('express');
const handleChat = require('../controllers/chatControllers.js');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// You can protect the route with your auth middleware
router.post('/chat', requireAuth, handleChat);

module.exports = router;
