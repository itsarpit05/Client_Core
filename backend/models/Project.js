const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required']
  },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Planning'
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  budget: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['Project Manager', 'Developer', 'Designer', 'QA', 'DevOps', 'Other'],
      default: 'Other'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  phases: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    startDate: Date,
    endDate: Date,
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
      default: 'Not Started'
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
  milestones: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  actualCost: {
    type: Number,
    default: 0
  },
  profitMargin: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
projectSchema.index({ name: 'text', description: 'text', status: 1, client: 1 });

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Virtual for project status
projectSchema.virtual('isOverdue').get(function() {
  if (this.endDate && this.status !== 'Completed') {
    return new Date() > this.endDate;
  }
  return false;
});

// Method to update progress
projectSchema.methods.updateProgress = function(newProgress) {
  this.progress = Math.max(0, Math.min(100, newProgress));
  if (this.progress === 100) {
    this.status = 'Completed';
  }
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);
