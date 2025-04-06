const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  eventId: {
    type: String,
    required: true
  },
  selection: {
    type: String,
    required: true
  },
  odds: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  potentialPayout: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost', 'void'],
    default: 'pending'
  },
  result: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bet', betSchema);
