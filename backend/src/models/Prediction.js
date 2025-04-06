const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  option: {
    type: String,
    required: true,
    enum: ['yes', 'no', 'draw']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  odds: {
    type: Number,
    required: true,
    min: 1
  },
  potentialWinnings: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'won', 'lost'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
