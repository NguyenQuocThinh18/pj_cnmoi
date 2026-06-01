/*
 * notificationRoutes.js
 * Định nghĩa các API notification endpoints
 */

const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getVapidKey,
  sendTestNotification,
  checkAppVersion,
  getStats
} = require('../controllers/notificationController');
const { verifyAdminOrStaff } = require('../middleware/verifyToken');

// Route public - không cần authentication
// 1. Lấy VAPID public key
router.get('/vapid-key', getVapidKey);

// 2. Đăng ký nhận thông báo
router.post('/subscribe', subscribe);

// 3. Hủy đăng ký thông báo
router.post('/unsubscribe', unsubscribe);

// 4. Kiểm tra phiên bản app
router.get('/version-check', checkAppVersion);

// Route public - cho phép test notification mà không cần auth
// 5. Gửi test notification (public để dễ debug)
router.post('/test', sendTestNotification);

// 6. Lấy thống kê subscribers (chỉ admin)
router.get('/stats', verifyAdminOrStaff, getStats);

module.exports = router;
