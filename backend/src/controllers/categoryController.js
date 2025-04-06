const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ active: true }).sort({ name: 1 });
  res.status(200).json(categories);
});

/**
 * @desc    Get single category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  res.status(200).json(category);
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  
  // Validate required fields
  if (!name) {
    res.status(400);
    throw new Error('Please provide a category name');
  }
  
  // Check if category already exists
  const categoryExists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }
  
  // Create the category
  const category = await Category.create({
    name,
    description: description || '',
    active: true
  });
  
  res.status(201).json(category);
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(200).json(updatedCategory);
});

/**
 * @desc    Delete category (set inactive)
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Soft delete by setting active to false
  category.active = false;
  await category.save();
  
  res.status(200).json({ message: 'Category removed' });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
