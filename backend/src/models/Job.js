const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', null],
    default: null
  },
  location: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Job source is required'],
    trim: true
  },
  jobUrl: {
    type: String,
    required: [true, 'Job URL is required'],
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
jobSchema.index({ industry: 1, role: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ location: 1 });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;