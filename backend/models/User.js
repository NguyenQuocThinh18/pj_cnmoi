/*
 * User.js
 * Mongoose model cho dữ liệu User.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  role: { type: String, default: "customer" } // Mặc định là khách hàng
}, { timestamps: true });

// Middleware tự động mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function () {
  // 1. Kiểm tra xem mật khẩu có bị thay đổi không (hoặc là tạo mới không)
  // Nếu không thay đổi (ví dụ chỉ đổi số điện thoại) thì bỏ qua mã hóa
  if (!this.isModified('password')) {
    return;
  }

  try {
    // 2. Tạo muối (salt)
    const salt = await bcrypt.genSalt(10);
    
    // 3. Mã hóa mật khẩu hiện tại với muối vừa tạo
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Throw error nếu có lỗi
  }
});

module.exports = mongoose.model('User', userSchema);