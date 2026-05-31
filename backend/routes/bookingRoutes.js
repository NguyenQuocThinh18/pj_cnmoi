/*
 * bookingRoutes.js
 * Định nghĩa các API đặt tour.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();

// ⚡ ĐÃ BỔ SUNG: Import middleware để bảo mật quyền quét vé
const { verifyAdminOrStaff } = require('../middleware/verifyToken'); 

const { 
    createBooking, 
    getAllBookings, 
    updateBooking, 
    getUserBookings,
    checkInBooking // 👈 ĐÃ BỔ SUNG hàm check-in
} = require('../controllers/bookingController');

// ⚠️ QUAN TRỌNG: Các đường dẫn cố định (như /track) PHẢI ĐẶT LÊN TRÊN CÙNG
router.get('/', getAllBookings);

// Các đường dẫn có tham số động (:id, :userId) bắt buộc phải đặt XUỐNG DƯỚI
router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.patch('/:id', updateBooking);
router.put('/:id', updateBooking);
router.put('/:id/pay', updateBooking);

// 🚀 ĐÃ BỔ SUNG: API Endpoint phục vụ điểm danh Check-in quét mã QR (Chỉ Admin/Staff)
router.put('/:id/checkin', verifyAdminOrStaff, checkInBooking);

module.exports = router;