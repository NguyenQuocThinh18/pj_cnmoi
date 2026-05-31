/*
 * Category.js
 * Mongoose model cho dữ liệu Category.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['Trong nước', 'Quốc tế'], default: 'Trong nước' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
