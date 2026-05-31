/*
 * categoryRoutes.js
 * Định nghĩa các API danh mục tour.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/verifyToken');
const {
  getAllCategories,
  getCategoriesByType,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Lấy tất cả danh mục
router.get('/', getAllCategories);

// Lấy danh mục theo loại
router.get('/type/:type', getCategoriesByType);

// Tạo danh mục (Admin)
router.post('/', verifyAdmin, createCategory);

// Cập nhật danh mục (Admin)
router.put('/:id', verifyAdmin, updateCategory);

// Xóa danh mục (Admin)
router.delete('/:id', verifyAdmin, deleteCategory);

module.exports = router;
