/*
 * authRoutes.js
 * Định nghĩa các API xác thực như register/login/forgot-password.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();
const { register, login, forgotPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;