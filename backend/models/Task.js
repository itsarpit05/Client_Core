const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assignee is required']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  estimatedHours: {
    type: Number,
    min: 0,
    default: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  dependencies: [{
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    type: {
      type: String,
      enum: ['blocks', 'blocked_by', 'related'],
      default: 'related'
    }
  }],
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
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  timeLogs: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: Date,
    duration: Number, // in minutes
    description: String
  }],
  completedAt: {
    type: Date
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['Development', 'Design', 'Testing', 'Documentation', 'Meeting', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

// Index for better search performance
taskSchema.index({ title: 'text', description: 'text', status: 1, assignee: 1, project: 1 });

// Virtual for task status
taskSchema.virtual('isOverdue').get(function() {
  if (this.dueDate && this.status !== 'Completed') {
    return new Date() > this.dueDate;
  }
  return false;
});

// Virtual for task progress
taskSchema.virtual('progress').get(function() {
  if (this.status === 'Completed') return 100;
  if (this.status === 'In Progress') return 50;
  if (this.status === 'On Hold') return 25;
  return 0;
});

// Method to update status
taskSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'Completed') {
    this.completedAt = new Date();
  }
  return this.save();
};

// Method to log time
taskSchema.methods.logTime = function(userId, startTime, endTime, description) {
  const duration = Math.round((endTime - startTime) / (1000 * 60)); // Convert to minutes
  this.timeLogs.push({
    user: userId,
    startTime,
    endTime,
    duration,
    description
  });
  this.actualHours += duration / 60; // Convert minutes to hours
  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);
