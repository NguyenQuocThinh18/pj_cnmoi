const express = require('express');
const router = express.Router();
const { verifyAdminOrStaff } = require('../middleware/verifyToken');
const { createRental, getAllRentals, updateRentalStatus, deleteRental } = require('../controllers/rentalController');

// ✅ CRUD endpoints cho quản lý thuê xe
router.post('/', verifyAdminOrStaff, createRental); // Thêm yêu cầu thuê xe (Protected)
router.get('/', verifyAdminOrStaff, getAllRentals); // Xem danh sách (Protected)
router.put('/:id', verifyAdminOrStaff, updateRentalStatus); // Cập nhật trạng thái (Protected)
router.delete('/:id', verifyAdminOrStaff, deleteRental); // Xóa (Protected)

module.exports = router;