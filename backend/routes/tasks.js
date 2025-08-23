const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('assignee', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', protect, [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('assignee').isMongoId().withMessage('Valid assignee ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

module.exports = router;
