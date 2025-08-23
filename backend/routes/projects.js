const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('client', 'name email')
      .populate('team.user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project
router.post('/', protect, [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Name must be between 2 and 200 characters'),
  body('client').isMongoId().withMessage('Valid client ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const project = await Project.create({
      ...req.body,
      assignedTo: req.user.id
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error creating project' });
  }
});

module.exports = router;
