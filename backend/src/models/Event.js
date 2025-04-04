const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    default: ''
  }
}, { _id: false });

const oddsSchema = new mongoose.Schema({
  option1: {
    type: Number,
    required: true
  },
  draw: {
    type: Number,
    default: null
  },
  option2: {
    type: Number,
    required: true
  }
}, { _id: false });

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  match: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming'
  },
  score: {
    type: String,
    default: ''
  },
  result: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  options: {
    option1: optionSchema,
    option2: optionSchema
  },
  odds: oddsSchema,
  countdown: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema); 