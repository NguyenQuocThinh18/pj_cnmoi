/*
 * rentalRoutes.js
 * Định nghĩa các API thuê xe.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();
const { verifyAdminOrStaff } = require('../middleware/verifyToken');
const { createRental, getAllRentals, updateRentalStatus, deleteRental } = require('../controllers/rentalController');

// ✅ CRUD endpoints cho quản lý thuê xe
router.post('/', createRental); // Thêm yêu cầu thuê xe (Công khai cho khách hàng)
router.get('/', verifyAdminOrStaff, getAllRentals); // Xem danh sách (Protected)
router.put('/:id', verifyAdminOrStaff, updateRentalStatus); // Cập nhật trạng thái (Protected)
router.delete('/:id', verifyAdminOrStaff, deleteRental); // Xóa (Protected)

module.exports = router;