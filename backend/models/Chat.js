/*
 * Chat.js
 * Mongoose model cho dữ liệu Chat.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
  role: { type: String, default: 'user' }
}, { 
  timestamps: true // Tự động ghi nhận thời gian tạo (createdAt)
});

module.exports = mongoose.model('Chat', chatSchema);