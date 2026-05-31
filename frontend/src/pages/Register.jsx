/*
 * Register.jsx
 * Trang đăng ký người dùng mới.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';

function Register() {
  const navigate = useNavigate();
  // Đã thêm phone vào state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Mật khẩu không khớp!');
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      if (response.data.success) {
        alert('Đăng ký thành công!');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi server hoặc email đã tồn tại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/assets/img/index/Vinh-ha-long.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="col-11 col-sm-8 col-md-6 col-lg-4">
        <div className="card border-0 shadow-lg rounded-4 p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-info font_DPTBlacksword">Đăng ký thành viên</h2>
          </div>

          {error && <div className="alert alert-danger py-2 text-center small">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="small fw-bold text-secondary">Họ và tên</label>
              <input type="text" className="form-control rounded-pill bg-light border-0" placeholder="Trần Minh Thái" onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div className="mb-3">
              <label className="small fw-bold text-secondary">Email</label>
              <input type="email" className="form-control rounded-pill bg-light border-0" placeholder="thai2026@gmail.com" onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
            </div>

            {/* Ô NHẬP SỐ ĐIỆN THOẠI ĐƯỢC THÊM VÀO ĐÂY */}
            <div className="mb-3">
              <label className="small fw-bold text-secondary">Số điện thoại</label>
              <input type="tel" className="form-control rounded-pill bg-light border-0" placeholder="(+84) 778 118 008" onChange={(e)=>setFormData({...formData, phone: e.target.value})} required />
            </div>

            <div className="mb-3">
              <label className="small fw-bold text-secondary">Mật khẩu</label>
              <input type="password" className="form-control rounded-pill bg-light border-0" placeholder="••••••" onChange={(e)=>setFormData({...formData, password: e.target.value})} required />
            </div>
            
            <div className="mb-4">
              <label className="small fw-bold text-secondary">Xác nhận mật khẩu</label>
              <input type="password" className="form-control rounded-pill bg-light border-0" placeholder="••••••" onChange={(e)=>setFormData({...formData, confirmPassword: e.target.value})} required />
            </div>
            
            <button type="submit" className="btn btn-info text-white w-100 rounded-pill fw-bold shadow-sm" disabled={loading}>ĐĂNG KÝ NGAY</button>
          </form>
          <p className="text-center mt-3 mb-0 small text-muted">Đã có tài khoản? <Link to="/login" className="text-info fw-bold text-decoration-none">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;