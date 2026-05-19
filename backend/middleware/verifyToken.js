// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

// 1. Hàm xác thực cơ bản (Cho phép tất cả: User, Staff, Admin)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ Header

  if (!token) return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn!" });
    
    req.user = user;
    next(); // Cho phép đi tiếp
  });
};

// 2. Hàm xác thực Admin (Chỉ Admin mới được vào)
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token không hợp lệ!" });
    
    // Kiểm tra quyền Admin
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập!" });
    }
    
    req.user = user;
    next(); 
  });
};

// 3. Hàm xác thực Admin hoặc Staff (Nhân viên và Admin được vào)
const verifyAdminOrStaff = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token không hợp lệ!" });
    
    // Kiểm tra: Cho phép Admin HOẶC Staff đi qua
    if (user.role !== 'admin' && user.role !== 'staff') {
      return res.status(403).json({ success: false, message: "Khu vực này chỉ dành cho Quản trị viên hoặc Nhân viên!" });
    }
    
    req.user = user;
    next(); 
  });
};

// ⚡ ĐÃ CẬP NHẬT: Xuất thêm hàm verifyToken ra để sử dụng bên routes
module.exports = { verifyToken, verifyAdmin, verifyAdminOrStaff };