const Event = require('../models/Event');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = asyncHandler(async (req, res) => {
  // Parse query parameters
  const status = req.query.status;
  const category = req.query.category;
  const featured = req.query.featured === 'true';
  
  // Build filter object
  const filter = {};
  if (status && status !== 'all') {
    filter.status = status;
  }
  if (category && category !== 'all') {
    filter.category = category;
  }
  if (req.query.featured !== undefined) {
    filter.featured = featured;
  }
  
  // Execute query
  const events = await Event.find(filter).sort({ date: 1 });
  res.status(200).json(events);
});

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  res.status(200).json(event);
});

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Private/Admin
 */
const createEvent = asyncHandler(async (req, res) => {
  console.log('Creating event with data:', req.body);
  
  const {
    title,
    match,
    category,
    date,
    time,
    venue,
    status,
    image,
    description,
    teams, // Old field name
    options, // New field name
    odds,
    featured
  } = req.body;
  
  // Validate required fields
  if (!title || !match || !category || !date || !time || !venue) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }
  
  // Validate odds - support both old and new field names
  if (!odds || !(odds.home || odds.option1) || !(odds.away || odds.option2)) {
    res.status(400);
    throw new Error('Please provide odds for the event');
  }
  
  // Format odds to use new field names
  const formattedOdds = {
    option1: odds.option1 || odds.home,
    draw: odds.draw || null,
    option2: odds.option2 || odds.away
  };
  
  // Handle both old and new field formats for teams/options
  let predictionOptions;
  
  if (options) {
    // Using new field format
    if (!options.option1 || !options.option2 || !options.option1.name || !options.option2.name) {
      res.status(400);
      throw new Error('Please provide information for both prediction options');
    }
    predictionOptions = options;
  } else if (teams) {
    // Using old field format - convert to new format
    if (!teams.home || !teams.away || !teams.home.name || !teams.away.name) {
      res.status(400);
      throw new Error('Please provide information for both prediction options');
    }
    predictionOptions = {
      option1: {
        name: teams.home.name,
        logo: teams.home.logo || ''
      },
      option2: {
        name: teams.away.name,
        logo: teams.away.logo || ''
      }
    };
  } else {
    res.status(400);
    throw new Error('Please provide prediction options information');
  }
  
  // Create the event
  const event = await Event.create({
    title,
    match,
    category,
    date,
    time,
    venue,
    status: status || 'upcoming',
    image,
    description,
    options: predictionOptions,
    odds: formattedOdds,
    featured: featured || false,
    // Don't require req.user for development
    createdBy: null
  });
  
  res.status(201).json(event);
});

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 */
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(200).json(updatedEvent);
});

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 */
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  await Event.findByIdAndDelete(req.params.id);
  
  res.status(200).json({ message: 'Event removed' });
});

/**
 * @desc    Update event status and result
 * @route   PUT /api/events/:id/result
 * @access  Private/Admin
 */
const updateEventResult = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  const { score, result, status } = req.body;
  
  if (!score && !result) {
    res.status(400);
    throw new Error('Please provide result information');
  }
  
  event.score = score || event.score;
  event.result = result || event.result;
  event.status = status || 'completed';
  
  const updatedEvent = await event.save();
  
  res.status(200).json(updatedEvent);
});

/**
 * @desc    Toggle event featured status
 * @route   PUT /api/events/:id/featured
 * @access  Private/Admin
 */
const toggleFeatured = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  event.featured = !event.featured;
  const updatedEvent = await event.save();
  
  res.status(200).json(updatedEvent);
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventResult,
  toggleFeatured
}; 