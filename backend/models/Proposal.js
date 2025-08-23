const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Proposal title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required']
  },
  status: {
    type: String,
    enum: ['lead', 'bidding', 'signature', 'hold', 'approved', 'rejected'],
    default: 'lead'
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  phases: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    estimatedHours: Number,
    estimatedCost: Number,
    order: Number
  }],
  totalValue: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  validUntil: {
    type: Date
  },
  signed: {
    type: Boolean,
    default: false
  },
  signedAt: {
    type: Date
  },
  signedBy: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Cold Call', 'Social Media', 'Trade Show', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

// Index for better search performance
proposalSchema.index({ title: 'text', description: 'text', status: 1, client: 1 });

// Virtual for formatted address
proposalSchema.virtual('formattedAddress').get(function() {
  if (this.address) {
    return this.address;
  }
  return 'Address not specified';
});

// Method to update status
proposalSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'approved') {
    this.signed = true;
    this.signedAt = new Date();
  }
  return this.save();
};

module.exports = mongoose.model('Proposal', proposalSchema);
