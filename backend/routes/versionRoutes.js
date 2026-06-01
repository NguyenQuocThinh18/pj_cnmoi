/*
 * versionRoutes.js
 * Routes cho quản lý version app
 */

const express = require('express');
const router = express.Router();
const {
  createVersion,
  getAllVersions,
  getLatestVersion,
  updateVersion,
  deleteVersion,
  notifyUpdate
} = require('../controllers/versionController');
const { verifyAdminOrStaff } = require('../middleware/verifyToken');

// Public routes
// 1. Lấy version mới nhất
router.get('/latest', getLatestVersion);

// 2. Lấy tất cả versions
router.get('/', getAllVersions);

// Admin routes
// 3. Tạo version mới
router.post('/', verifyAdminOrStaff, createVersion);

// 4. Cập nhật version
router.put('/:id', verifyAdminOrStaff, updateVersion);

// 5. Xóa version
router.delete('/:id', verifyAdminOrStaff, deleteVersion);

// 6. Gửi notification cho version
router.post('/:id/notify', verifyAdminOrStaff, notifyUpdate);

module.exports = router;
