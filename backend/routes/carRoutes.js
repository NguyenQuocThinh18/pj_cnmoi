/*
 * carRoutes.js
 * Định nghĩa các API quản lý xe.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();
const { verifyAdminOrStaff } = require('../middleware/verifyToken');
const { 
    createCar, 
    getAllCars, 
    getCarById, 
    updateCar, 
    deleteCar, 
    updateCarStatus 
} = require('../controllers/carController');

// ✅ CRUD endpoints cho quản lý xe (Tất cả đều cần auth)
router.post('/', verifyAdminOrStaff, createCar); // Thêm xe mới
router.get('/', getAllCars); // Lấy danh sách xe (công khai)
router.get('/:id', getCarById); // Lấy chi tiết xe
router.put('/:id', verifyAdminOrStaff, updateCar); // Cập nhật xe
router.put('/:id/status', verifyAdminOrStaff, updateCarStatus); // Cập nhật trạng thái
router.delete('/:id', verifyAdminOrStaff, deleteCar); // Xóa xe

module.exports = router;
