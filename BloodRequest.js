/**
 * BloodRequest Model - Blood request from patients
 * Tracks request status, matching donors, and urgency levels
 */

const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  // Patient who made the request
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },

  // Blood requirement details
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsNeeded: {
    type: Number,
    required: [true, 'Number of units is required'],
    min: 1,
    max: 10
  },

  // Hospital details
  hospitalName: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },

  // Request urgency and status
  urgency: {
    type: String,
    enum: ['normal', 'emergency'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled'],
    default: 'pending'
  },

  // Donor tracking
  notifiedDonors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  respondedDonors: [{
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    response: {
      type: String,
      enum: ['accepted', 'declined']
    },
    respondedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Additional notes
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for geolocation queries and blood group searches
bloodRequestSchema.index({ location: '2dsphere' });
bloodRequestSchema.index({ bloodGroup: 1, status: 1 });
bloodRequestSchema.index({ urgency: 1, createdAt: -1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
