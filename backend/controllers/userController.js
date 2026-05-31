/*
 * userController.js
 * Quản lý người dùng, phân quyền và thông tin tài khoản.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs'); // ⚡ ĐÃ THÊM: Thư viện mã hóa mật khẩu

// Lấy tất cả users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const users = await User.find()
      .select('-password') // Exclude password
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}?${new URLSearchParams(req.query).toString()}`,
      first: `${baseUrl}?page=1&limit=${limitNum}`,
      last: `${baseUrl}?page=${Math.ceil(total / limitNum)}&limit=${limitNum}`,
    };
    
    if (pageNum > 1) links.prev = `${baseUrl}?page=${pageNum - 1}&limit=${limitNum}`;
    if (pageNum < Math.ceil(total / limitNum)) links.next = `${baseUrl}?page=${pageNum + 1}&limit=${limitNum}`;
    
    res.set('Cache-Control', 'private, max-age=60'); // Cache 1 minute for admin
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: users,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách user' });
  }
};

// Cập nhật user (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}/${updatedUser._id}`,
      collection: `${baseUrl}`,
      bookings: `${req.protocol}://${req.get('host')}/api/bookings?userId=${updatedUser._id}`
    };
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công',
      data: updatedUser,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật user', error: error.message });
  }
};

// Xóa user (Admin)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa user thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xóa user', error: error.message });
  }
};

// ====================================================================
// ⚡ ĐÃ THÊM MỚI: Cập nhật thông tin Profile (Tên, SĐT)
// ====================================================================
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const phoneRegex = /^\+?[\d\s\-]{9,15}$/;
    if (phone && !phoneRegex.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ. Vui lòng nhập 9-15 chữ số.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, phone } },
      { new: true }
    ).select('-password'); // Không trả về password cho bảo mật
    
    if (!updatedUser) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật hồ sơ', error: error.message });
  }
};

// ====================================================================
// ⚡ ĐÃ THÊM MỚI: Đổi mật khẩu an toàn
// ====================================================================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    // Kiểm tra mật khẩu cũ có khớp không
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác!' });

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi đổi mật khẩu', error: error.message });
  }
};

// ⚡ ĐÃ CẬP NHẬT: Xuất tất cả các hàm ra để router sử dụng
module.exports = { getAllUsers, updateUser, deleteUser, updateProfile, changePassword };