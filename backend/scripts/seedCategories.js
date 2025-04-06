require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../src/models/Category');
const connectDB = require('../src/config/db');

// Initial categories to seed
const categories = [
  { name: 'General', description: 'General events and topics' },
  { name: 'Sports', description: 'Sports events and competitions' },
  { name: 'Politics', description: 'Political events and elections' },
  { name: 'Entertainment', description: 'Entertainment industry events' },
  { name: 'Finance', description: 'Financial markets and economic events' },
  { name: 'Technology', description: 'Technology industry events and releases' },
  { name: 'Weather', description: 'Weather-related events and forecasts' },
  { name: 'Social', description: 'Social events and trends' },
  { name: 'Pop Culture', description: 'Pop culture events and trends' },
  { name: 'Other', description: 'Miscellaneous events' }
];

// Connect to database
connectDB();

// Seed categories
const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Deleted existing categories');

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Inserted ${createdCategories.length} categories`);

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run the seeding function
seedCategories();
