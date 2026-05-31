/*
 * ProtectedRoute.jsx
 * Kiểm tra xác thực và quyền trước khi truy cập route được bảo vệ.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const user = userString ? JSON.parse(userString) : null;

  // Nếu chưa đăng nhập hoặc không có token hợp lệ hoặc không phải admin/staff -> Đá về trang Login
  if (!user || !token || token === 'null' || token === 'undefined' || (user.role !== 'admin' && user.role !== 'staff')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert("Khu vực này chỉ dành cho Admin/Staff nhé!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;