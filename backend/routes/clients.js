const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Client = require('../models/Client');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all clients with pagination and search
// @route   GET /api/clients
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('type').optional().isIn(['Client', 'Supplier', 'Partner']).withMessage('Invalid type'),
  query('status').optional().isIn(['Active', 'Inactive', 'Prospect', 'Lead']).withMessage('Invalid status'),
  query('industry').optional().trim(),
  query('sortBy').optional().isIn(['name', 'createdAt', 'totalRevenue', 'totalProjects']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    // Check for validation errors
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
      type,
      status,
      industry,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (industry) filter.industry = { $regex: industry, $options: 'i' };
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const clients = await Client.find(filter)
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Client.countDocuments(filter);

    res.json({
      success: true,
      data: clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedTo', 'name email department');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Get client error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
router.post('/', protect, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('type').isIn(['Client', 'Supplier', 'Partner']).withMessage('Invalid type'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim(),
  body('industry').optional().trim().isLength({ max: 100 }).withMessage('Industry cannot exceed 100 characters'),
  body('status').optional().isIn(['Active', 'Inactive', 'Prospect', 'Lead']).withMessage('Invalid status'),
  body('source').optional().isIn(['Website', 'Referral', 'Cold Call', 'Social Media', 'Other']).withMessage('Invalid source')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const clientData = {
      ...req.body,
      assignedTo: req.user.id
    };

    const client = await Client.create(clientData);

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Create client error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }
    res.status(500).json({ message: 'Server error creating client' });
  }
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
router.put('/:id', protect, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('type').optional().isIn(['Client', 'Supplier', 'Partner']).withMessage('Invalid type'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim(),
  body('industry').optional().trim().isLength({ max: 100 }).withMessage('Industry cannot exceed 100 characters'),
  body('status').optional().isIn(['Active', 'Inactive', 'Prospect', 'Lead']).withMessage('Invalid status'),
  body('source').optional().isIn(['Website', 'Referral', 'Cold Call', 'Social Media', 'Other']).withMessage('Invalid source')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    let client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update client
    client = await Client.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastContact: new Date() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Update client error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }
    res.status(500).json({ message: 'Server error updating client' });
  }
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await client.remove();

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(500).json({ message: 'Server error deleting client' });
  }
});

// @desc    Get client statistics
// @route   GET /api/clients/stats/overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const stats = await Client.aggregate([
      {
        $group: {
          _id: null,
          totalClients: { $sum: 1 },
          totalRevenue: { $sum: '$totalRevenue' },
          activeClients: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          prospects: {
            $sum: { $cond: [{ $eq: ['$status', 'Prospect'] }, 1, 0] }
          }
        }
      }
    ]);

    const typeStats = await Client.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const industryStats = await Client.aggregate([
      {
        $match: { industry: { $exists: true, $ne: '' } }
      },
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalClients: 0,
          totalRevenue: 0,
          activeClients: 0,
          prospects: 0
        },
        byType: typeStats,
        topIndustries: industryStats
      }
    });
  } catch (error) {
    console.error('Get client stats error:', error);
    res.status(500).json({ message: 'Server error getting statistics' });
  }
});

module.exports = router;
