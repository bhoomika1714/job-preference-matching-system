const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  preferredIndustries: {
    type: [String],
    default: []
  },
  preferredRoles: {
    type: [String],
    default: []
  },
  preferredSkills: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    trim: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', null],
    default: null
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'remote', null],
    default: null
  }
}, {
  timestamps: true
});

// Create index for better query performance
candidateSchema.index({ email: 1 });
candidateSchema.index({ preferredSkills: 1 });

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;