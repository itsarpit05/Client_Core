const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Proposal = require('../models/Proposal');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all proposals with pagination and search
// @route   GET /api/proposals
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('status').optional().isIn(['lead', 'bidding', 'signature', 'hold', 'approved', 'rejected']).withMessage('Invalid status'),
  query('client').optional().isMongoId().withMessage('Invalid client ID'),
  query('assignedTo').optional().isMongoId().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 10,
      search,
      status,
      client,
      assignedTo
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (client) filter.client = client;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const proposals = await Proposal.find(filter)
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Proposal.countDocuments(filter);

    res.json({
      success: true,
      data: proposals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get proposals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get proposals by status (for Kanban board)
// @route   GET /api/proposals/kanban
// @access  Private
router.get('/kanban', protect, async (req, res) => {
  try {
    const proposals = await Proposal.find({})
      .populate('client', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    // Group by status
    const kanbanData = {
      lead: proposals.filter(p => p.status === 'lead'),
      bidding: proposals.filter(p => p.status === 'bidding'),
      signature: proposals.filter(p => p.status === 'signature'),
      hold: proposals.filter(p => p.status === 'hold'),
      approved: proposals.filter(p => p.status === 'approved')
    };

    res.json({
      success: true,
      data: kanbanData
    });
  } catch (error) {
    console.error('Get kanban proposals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single proposal
// @route   GET /api/proposals/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('client', 'name email phone address')
      .populate('assignedTo', 'name email department');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Get proposal error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new proposal
// @route   POST /api/proposals
// @access  Private
router.post('/', protect, [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('client').isMongoId().withMessage('Valid client ID is required'),
  body('status').optional().isIn(['lead', 'bidding', 'signature', 'hold', 'approved', 'rejected']).withMessage('Invalid status'),
  body('address').optional().trim().isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const proposalData = {
      ...req.body,
      assignedTo: req.user.id
    };

    const proposal = await Proposal.create(proposalData);

    res.status(201).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Create proposal error:', error);
    res.status(500).json({ message: 'Server error creating proposal' });
  }
});

// @desc    Update proposal
// @route   PUT /api/proposals/:id
// @access  Private
router.put('/:id', protect, [
  body('title').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('status').optional().isIn(['lead', 'bidding', 'signature', 'hold', 'approved', 'rejected']).withMessage('Invalid status'),
  body('address').optional().trim().isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    let proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Update proposal error:', error);
    res.status(500).json({ message: 'Server error updating proposal' });
  }
});

// @desc    Update proposal status
// @route   PATCH /api/proposals/:id/status
// @access  Private
router.patch('/:id/status', protect, [
  body('status').isIn(['lead', 'bidding', 'signature', 'hold', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    await proposal.updateStatus(req.body.status);

    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Update proposal status error:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// @desc    Delete proposal
// @route   DELETE /api/proposals/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    await proposal.remove();

    res.json({
      success: true,
      message: 'Proposal deleted successfully'
    });
  } catch (error) {
    console.error('Delete proposal error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    res.status(500).json({ message: 'Server error deleting proposal' });
  }
});

module.exports = router;
