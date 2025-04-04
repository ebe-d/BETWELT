const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Trying to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_DB);
    
    await mongoose.connect(process.env.MONGO_DB);
    
    console.log('Successfully connected to MongoDB!');
    
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Run the test
testConnection(); 