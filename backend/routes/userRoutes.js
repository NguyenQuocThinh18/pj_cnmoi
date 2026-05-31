/*
 * userRoutes.js
 * Định nghĩa các API người dùng.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();

// ⚡ ĐÃ THÊM: verifyToken để khách hàng bình thường cũng có thể tự sửa thông tin của họ
const { verifyAdmin, verifyToken } = require('../middleware/verifyToken');

// ⚡ ĐÃ THÊM: Nhập 2 hàm updateProfile và changePassword từ controller
const { 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    updateProfile, 
    changePassword 
} = require('../controllers/userController');

// Lấy tất cả users (Admin)
router.get('/', verifyAdmin, getAllUsers);

// Cập nhật user (Admin)
router.put('/:id', verifyAdmin, updateUser);

// Xóa user (Admin)
router.delete('/:id', verifyAdmin, deleteUser);

// =========================================================
// 🚀 ĐÃ BỔ SUNG: API CẬP NHẬT THÔNG TIN CÁ NHÂN & MẬT KHẨU
// =========================================================

// Khách hàng tự cập nhật thông tin cá nhân (Tên, SĐT)
router.put('/:id/profile', verifyToken, updateProfile);

// Khách hàng tự đổi mật khẩu
router.put('/:id/password', verifyToken, changePassword);

module.exports = router;