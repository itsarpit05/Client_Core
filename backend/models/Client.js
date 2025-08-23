const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['Client', 'Supplier', 'Partner'],
    required: [true, 'Client type is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  industry: {
    type: String,
    trim: true,
    maxlength: [100, 'Industry cannot exceed 100 characters']
  },
  contactPerson: {
    name: String,
    position: String,
    email: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Prospect', 'Lead'],
    default: 'Active'
  },
  totalProjects: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastContact: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Cold Call', 'Social Media', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

// Index for better search performance
clientSchema.index({ name: 'text', email: 'text', industry: 'text' });

module.exports = mongoose.model('Client', clientSchema);
