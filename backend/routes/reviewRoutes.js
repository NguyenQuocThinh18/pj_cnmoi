/*
 * reviewRoutes.js
 * Định nghĩa các API đánh giá/bình luận.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getTourReviews, 
  getBlogReviews, // Thêm hàm này
  getAllReviews,  // Thêm hàm này cho Admin
  deleteReview 
} = require('../controllers/reviewController');

// 1. Gửi đánh giá (Dùng chung cho cả Tour và Blog)
router.post('/', createReview);

// 2. Lấy TẤT CẢ đánh giá (Dành cho trang Quản trị Admin)
router.get('/all', getAllReviews); 

// 3. Lấy đánh giá của 1 Tour cụ thể
router.get('/:tourId', getTourReviews);

// 4. Lấy bình luận của 1 bài Blog cụ thể (QUAN TRỌNG: Fix lỗi 404)
router.get('/blog/:blogId', getBlogReviews); 

router.delete('/:id', deleteReview);

module.exports = router;