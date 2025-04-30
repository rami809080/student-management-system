// src/models/Class.js
import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Please provide a class name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: [true, 'Please assign a teacher'], // Make required if necessary
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  }],
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
ClassSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add index for faster searching/sorting if needed
ClassSchema.index({ className: 1 });

// Check if the model already exists before defining it
export default mongoose.models.Class || mongoose.model('Class', ClassSchema);

