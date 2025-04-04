const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const requireAuth = ClerkExpressWithAuth({
  onError: (err, req, res, next) => {
    console.error("Clerk Auth Error:", err);
    return res.status(401).json({ error: "Unauthorized. Invalid token." });
  },
});

// Middleware to check if the user is an admin
const adminOnly = [
  requireAuth,
  asyncHandler(async (req, res, next) => {
    try {
      // Get the user from our database using the Clerk user ID
      const user = await User.findOne({ clerkId: req.auth.userId });
      
      if (!user) {
        res.status(404);
        throw new Error('User not found in our database');
      }
      
      // Check if the user is an admin
      if (user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized as an admin');
      }
      
      // Store the user in the request object
      req.user = user;
      
      next();
    } catch (error) {
      res.status(error.statusCode || 403);
      res.json({
        message: error.message || 'Not authorized as an admin'
      });
    }
  })
];

module.exports = {
  requireAuth,
  adminOnly
};
