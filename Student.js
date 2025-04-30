// src/models/Student.js
import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true,
  },
  fatherName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true,
  },
  guardian: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  idNumber: {
    type: String,
    trim: true,
    unique: true, // Assuming ID number should be unique
    sparse: true, // Allow multiple null/undefined values if not required
  },
  photoUrl: {
    type: String, // Store the URL of the uploaded photo
    trim: true,
  },
  socialStatus: {
    type: String,
    trim: true,
  },
  academicStatus: {
    type: String,
    trim: true,
  },
  behavior: {
    type: String,
    trim: true,
  },
  healthStatus: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // Reference to the Class model (to be created later)
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` field before saving
StudentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add index for faster searching/sorting if needed, e.g., by name
StudentSchema.index({ lastName: 1, firstName: 1 });

// Check if the model already exists before defining it
export default mongoose.models.Student || mongoose.model('Student', StudentSchema);

