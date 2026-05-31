/*
 * Login.jsx
 * Trang đăng nhập người dùng.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';

function Login() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Trạng thái: Đang đăng nhập với quyền gì?
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      
      if (res.data.success) {
        const user = res.data.data;
        
        // ĐÃ FIX: Cho phép CẢ ADMIN VÀ STAFF đăng nhập qua cổng này
        if (isAdmin && user.role !== 'admin' && user.role !== 'staff') {
          alert("Khu vực này chỉ dành cho Quản trị viên hoặc Nhân viên!");
          setLoading(false);
          return;
        }

        // 2. Lưu thông tin vào máy
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(user));

        alert(`Chào mừng ${isAdmin ? (user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên') : ''} ${user.name} quay trở lại!`);

        // ĐÃ FIX: ĐIỀU HƯỚNG THÔNG MINH (Admin và Staff đều vào được Dashboard)
        if (user.role === 'admin' || user.role === 'staff') {
          navigate('/admin'); // Vào thẳng trang quản trị
        } else {
          navigate('/'); // Về trang chủ
        }
        
        window.location.reload(); // Làm mới để Navbar cập nhật tên
      }
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center" 
         style={{ minHeight: '100vh', background: 'url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1500&q=80") center/cover' }}>
      
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" 
           style={{ width: '450px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        
        {/* TAB CHUYỂN ĐỔI */}
        <div className="d-flex text-center border-bottom">
          <div 
            className={`w-50 py-3 fw-bold cursor-pointer transition-all ${!isAdmin ? 'bg-info text-white' : 'text-secondary bg-white'}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setIsAdmin(false)}
          >
            KHÁCH HÀNG
          </div>
          <div 
            className={`w-50 py-3 fw-bold cursor-pointer transition-all ${isAdmin ? 'bg-dark text-white' : 'text-secondary bg-white'}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setIsAdmin(true)}
          >
            QUẢN TRỊ VIÊN
          </div>
        </div>

        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="font_DPTBlacksword text-info fs-1">Du lịch Việt</h2>
            <p className="text-muted small">Chào mừng {isAdmin ? 'Quản trị viên' : 'bạn'} trở lại! 👋</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">Email đăng nhập</label>
              <input 
                type="email" name="email" className="form-control rounded-pill px-4 py-2 border-0 bg-light" 
                placeholder="email@example.com" onChange={handleChange} required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold small text-secondary">Mật khẩu</label>
              <div className="position-relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  className="form-control rounded-pill px-4 py-2 border-0 bg-light pe-5" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  required 
                />
                <button 
                  type="button" 
                  className="btn position-absolute end-0 top-50 translate-middle-y me-3 border-0 bg-transparent text-secondary" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ zIndex: 5 }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* XỬ LÝ ẨN/HIỆN NÚT QUÊN MẬT KHẨU TẠI ĐÂY */}
            {!isAdmin ? (
              <div className="text-end mb-4">
                <Link to="/forgot-password" size="small" className="text-info text-decoration-none small fw-bold">Quên mật khẩu?</Link>
              </div>
            ) : (
              <div className="text-center mb-4 mt-3">
                <small className="text-danger fst-italic" style={{fontSize: '12px'}}>
                  <i className="bi bi-shield-lock me-1"></i>
                  * Để khôi phục mật khẩu vui lòng liên hệ phòng Quản trị.
                </small>
              </div>
            )}

            <button 
              type="submit" 
              className={`btn w-100 rounded-pill py-2 fw-bold shadow-sm transition-all ${isAdmin ? 'btn-dark' : 'btn-info text-white'}`}
              disabled={loading}
            >
              {loading ? 'ĐANG XỬ LÝ...' : `ĐĂNG NHẬP ${isAdmin ? 'ADMIN' : ''}`}
            </button>
          </form>

          {!isAdmin && (
            <div className="text-center mt-4">
              <span className="text-muted small">Chưa có tài khoản? </span>
              <Link to="/register" className="text-info text-decoration-none small fw-bold">Đăng ký ngay</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;