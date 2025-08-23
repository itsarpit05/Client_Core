const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all employees
router.get('/', protect, async (req, res) => {
  try {
    const employees = await User.find({ role: { $in: ['employee', 'manager'] } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create employee (admin only)
router.post('/', protect, authorize('admin'), [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['employee', 'manager']).withMessage('Invalid role'),
  body('department').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const employee = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error creating employee' });
  }
});

module.exports = router;
