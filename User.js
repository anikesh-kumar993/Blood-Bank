/**
 * User Model - Unified model for Donors, Patients, Hospitals, and Admins
 * Uses a 'role' field to differentiate user types with role-specific fields
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Common fields for all roles
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
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['donor', 'patient', 'hospital', 'admin'],
    default: 'donor'
  },

  // Donor-specific fields
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  age: {
    type: Number,
    min: 18,
    max: 65
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  address: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  lastDonationDate: {
    type: Date
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  donationHistory: [{
    date: Date,
    hospital: String,
    units: { type: Number, default: 1 }
  }],

  // Hospital-specific fields
  hospitalName: {
    type: String,
    trim: true
  },
  hospitalAddress: {
    type: String,
    trim: true
  },
  availableBloodUnits: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geolocation queries
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
