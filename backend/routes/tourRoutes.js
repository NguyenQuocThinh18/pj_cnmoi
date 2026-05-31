/*
 * tourRoutes.js
 * Định nghĩa các API tour du lịch.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();
// Đã thay đổi import middleware
const { verifyAdminOrStaff } = require('../middleware/verifyToken');
const { 
  createTour, 
  getAllTours, 
  getTourById, 
  updateTour, 
  deleteTour
} = require('../controllers/tourController');

// 1. Lấy toàn bộ danh sách tour (hỗ trợ search/filter qua query params)
router.get('/', getAllTours);

// 2. Tạo tour mới (Admin hoặc Staff)
router.post('/', verifyAdminOrStaff, createTour);

// 3. Lấy chi tiết 1 tour theo ID
router.get('/:id', getTourById);

// 4. Cập nhật thông tin tour (Admin hoặc Staff)
router.put('/:id', verifyAdminOrStaff, updateTour);

// 5. Xóa tour (Admin hoặc Staff)
router.delete('/:id', verifyAdminOrStaff, deleteTour);

module.exports = router;