/*
 * blogRoutes.js
 * Định nghĩa các API bài viết blog.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();
// Import thêm middleware phân quyền
const { verifyAdminOrStaff } = require('../middleware/verifyToken');
const { 
    getAllBlogs, 
    getBlogById, 
    createBlog, 
    updateBlog, 
    deleteBlog 
} = require('../controllers/blogController');

// --- CÁC ĐƯỜNG DẪN CÔNG KHAI (Dành cho Khách vãng lai & Thành viên) ---
// Lấy danh sách toàn bộ bài viết
router.get('/', getAllBlogs); 

// Lấy chi tiết một bài viết theo ID (Dùng cho trang BlogDetail)
router.get('/:id', getBlogById); 

// --- CÁC ĐƯỜNG DẪN CẦN QUYỀN (Dành cho Quản trị viên & Nhân viên) ---
// Thêm mới, cập nhật và xóa bài viết
router.post('/', verifyAdminOrStaff, createBlog);
router.put('/:id', verifyAdminOrStaff, updateBlog);
router.delete('/:id', verifyAdminOrStaff, deleteBlog);

module.exports = router;