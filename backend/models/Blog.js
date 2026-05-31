/*
 * Blog.js
 * Script cũ xử lý danh sách blog.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Nội dung chi tiết bài viết
    image: { type: String, required: true },   // Ảnh bìa
    category: { 
        type: String, 
        default: 'Cẩm Nang Du Lịch' 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Lấy tên Admin nào đăng bài
    },
    featured: { type: Boolean, default: false }, // Bài viết nổi bật
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);