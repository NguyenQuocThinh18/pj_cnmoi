/*
 * Review.js
 * Mongoose model cho dữ liệu Review.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // TourID và BlogID để required: false để linh hoạt
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: false 
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: false 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'approved',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);