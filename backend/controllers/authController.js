/*
 * authController.js
 * Xử lý xác thực người dùng.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ [Email Config] Lỗi cấu hình:', error.message);
  } else {
    console.log('✅ [Email Config] Đã sẵn sàng gửi email');
  }
});

const register = async (req, res) => {
  // Nhận dữ liệu từ body request
  const { name, email, password, phone, role } = req.body; // Thêm nhận role từ admin
  try {
    // Kiểm tra xem email đã tồn tại trong DB chưa
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Email đã tồn tại!' });
    
    // Tạo user mới. Nếu admin truyền role thì dùng role đó, còn user thường mặc định 'user'
    await User.create({ name, email, password, phone, role: role || 'user' });
    res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
  } catch (error) {
    // Nếu có lỗi server thì trả về 500
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Email không tồn tại!" });

    // So sánh password gửi lên với password đã hash trong DB
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ success: false, message: "Sai mật khẩu!" });

    // Tạo JWT chứa id và role của user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15d' });
    res.status(200).json({ success: true, message: "Đăng nhập thành công", token, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập email để khôi phục mật khẩu.' });
    }

    // Tìm tài khoản theo email đã nhập
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy email này trong hệ thống.' });
    }

    // Tạo liên kết reset hoặc trang login để hiển thị trong email
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
    const mailOptions = {
      from: `"Du Lịch Việt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Yêu cầu khôi phục mật khẩu - Du Lịch Việt',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1f2937;">
          <h2 style="color: #0ea5e9;">Yêu cầu khôi phục mật khẩu</h2>
          <p>Xin chào <strong>${user.name}</strong>,</p>
          <p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản này.</p>
          <p>Hiện tại hệ thống chưa triển khai giao diện đặt lại mật khẩu tự động, vì vậy vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để được cấp lại mật khẩu.</p>
          <p><strong>Hoặc</strong> truy cập lại trang đăng nhập của bạn:</p>
          <p><a href="${resetLink}" style="color: #0ea5e9;">${resetLink}</a></p>
          <p>Nếu bạn không yêu cầu khôi phục mật khẩu, hãy bỏ qua email này.</p>
          <p style="margin-top: 24px; font-size: 0.9rem; color: #6b7280;">Email này được gửi tự động bởi hệ thống Du Lịch Việt.</p>
        </div>
      `,
    };

    // Gửi email qua transporter đã cấu hình Gmail
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log('❌ Lỗi gửi email khôi phục mật khẩu:', error.message);
      }
    });

    return res.status(200).json({ success: true, message: 'Hướng dẫn khôi phục mật khẩu đã được gửi tới email của bạn.' });
  } catch (error) {
    console.error('❌ [forgotPassword] Lỗi:', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi khi xử lý yêu cầu khôi phục mật khẩu.' });
  }
};

module.exports = { register, login, forgotPassword };