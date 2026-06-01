/*
 * Account.jsx
 * Trang quản lý thông tin cá nhân người dùng.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../utils/imagePath'; 
import Swal from 'sweetalert2';

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- TRẠNG THÁI MODAL CHỈNH SỬA & ĐỔI MẬT KHẨU ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Dữ liệu form
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert('Bạn cần đăng nhập để xem thông tin!');
      navigate('/login');
      return;
    }
    
    const currentUser = JSON.parse(userString);
    setUser(currentUser);
    setEditForm({ name: currentUser.name || '', phone: currentUser.phone || '' });

    const fetchMyBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings/user/${currentUser._id}`);
        if (res.data.success) {
          setMyBookings(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi tải lịch sử đặt tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // ====================================================================
  // ⚡ XỬ LÝ LƯU CẬP NHẬT THÔNG TIN CÁ NHÂN (PROFILE)
  // ====================================================================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const phonePattern = /^\+?[\d\s\-]{9,15}$/;
    if (!phonePattern.test(editForm.phone.trim())) {
      return Swal.fire('Lỗi', 'Số điện thoại không hợp lệ. Vui lòng nhập từ 9 đến 15 chữ số.', 'error');
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/api/users/${user._id}/profile`, editForm, getAuthHeaders());
      if (res.data.success) {
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Cập nhật thông tin thành công!', timer: 2500 });
        
        // Cập nhật lại giao diện và LocalStorage để không cần F5
        const updatedUser = { ...user, name: editForm.name, phone: editForm.phone };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowEditModal(false);
      }
    } catch (error) {
      Swal.fire('Lỗi', error.response?.data?.message || 'Không thể cập nhật thông tin!', 'error');
    }
  };

  // ====================================================================
  // ⚡ XỬ LÝ ĐỔI MẬT KHẨU AN TOÀN
  // ====================================================================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp!', 'error');
    }
    if (passwordForm.newPassword.length < 6) {
      return Swal.fire('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/api/users/${user._id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, getAuthHeaders());

      if (res.data.success) {
        Swal.fire('Thành công', 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', 'success').then(() => {
          handleLogout(); // Ép văng ra ngoài bắt đăng nhập lại bằng pass mới
        });
      }
    } catch (error) {
      Swal.fire('Lỗi', error.response?.data?.message || 'Mật khẩu hiện tại không chính xác!', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-light min-vh-100 py-5">
      <style dangerouslySetInnerHTML={{ __html: `
        .profile-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1050; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px); }
        .profile-modal-box { background: white; width: 90%; max-width: 450px; border-radius: 20px; padding: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: popIn 0.3s ease-out forwards; position: relative; }
        @keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .profile-modal-close { position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; color: #6c757d; cursor: pointer; transition: 0.2s; }
        .profile-modal-close:hover { color: #dc3545; transform: scale(1.1); }
      `}} />

      <div className="container py-4">
        <h2 className="fw-bold mb-4">Hồ sơ cá nhân</h2>
        
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 text-center p-4 sticky-top" style={{ top: '75px' }}>
              <div className="mb-3">
                <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold display-4 shadow-sm" style={{ width: '100px', height: '100px' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <h4 className="fw-bold mb-1">{user.name}</h4>
              <p className="text-muted small mb-4">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng thành viên'}</p>
              
              <ul className="list-group list-group-flush text-start mb-4">
                <li className="list-group-item bg-transparent px-0 py-3 text-secondary">
                  <i className="bi bi-envelope-at me-2 text-info"></i> {user.email}
                </li>
                <li className="list-group-item bg-transparent px-0 py-3 text-secondary">
                  <i className="bi bi-telephone me-2 text-info"></i> {user.phone || 'Chưa cập nhật số điện thoại'}
                </li>
              </ul>
              
              {/* --- BỔ SUNG NÚT ĐỔI THÔNG TIN VÀ PASS --- */}
              <button onClick={() => setShowEditModal(true)} className="btn btn-outline-info w-100 rounded-pill fw-bold mb-2 shadow-sm">
                <i className="bi bi-pencil-square me-2"></i> Chỉnh sửa thông tin
              </button>
              
              <button onClick={() => setShowPasswordModal(true)} className="btn btn-outline-warning text-dark w-100 rounded-pill fw-bold mb-4 shadow-sm">
                <i className="bi bi-shield-lock me-2"></i> Đổi mật khẩu
              </button>

              <button onClick={handleLogout} className="btn btn-danger w-100 rounded-pill fw-bold shadow-sm">
                <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-4 pb-2 border-bottom">Chuyến đi của tôi ({myBookings.length})</h5>
              
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border text-info"></div></div>
              ) : myBookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-journal-x text-muted" style={{ fontSize: '4rem' }}></i>
                  <p className="mt-3 text-secondary">Bạn chưa đặt chuyến đi nào.</p>
                  <Link to="/tour-trong-nuoc" className="btn btn-info text-white rounded-pill px-4 fw-bold">Khám phá Tour ngay</Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {myBookings.map((booking) => (
                    
                    <div 
                      key={booking._id} 
                      className="card border border-light bg-light rounded-4 overflow-hidden shadow-sm"
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                      onClick={() => navigate(`/ticket/${booking._id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                      }}
                      title="Nhấp vào để xem Vé Điện Tử (QR Code)"
                    >
                      <div className="row g-0 align-items-center">
                        <div className="col-md-3">
                          <img 
                            src={resolveImageUrl(booking.tourId?.image) || "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500&q=80"} 
                            className="img-fluid w-100 h-100" 
                            style={{ objectFit: 'cover', minHeight: '130px' }} 
                            alt="Tour"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500&q=80'; }}
                          />
                        </div>
                        <div className="col-md-9">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="card-title fw-bold text-info mb-0" style={{ maxWidth: '75%' }}>
                                {booking.tourId?.title || 'Tour này đã ngưng phục vụ'}
                              </h5>
                              
                              {booking.status === 'paid' && (
                                <span className="badge rounded-pill px-3 py-2 bg-success shadow-sm">Đã thanh toán</span>
                              )}
                              {(booking.status === 'pending' || booking.status === 'pending_confirmation') && (
                                <span className="badge rounded-pill px-3 py-2 bg-primary shadow-sm">Chờ xác nhận</span>
                              )}
                              {booking.status === 'cancelled' && (
                                <span className="badge rounded-pill px-3 py-2 bg-danger shadow-sm">Đã hủy</span>
                              )}
                              {booking.status !== 'paid' && booking.status !== 'pending' && booking.status !== 'pending_confirmation' && booking.status !== 'cancelled' && (
                                <span className="badge rounded-pill px-3 py-2 bg-warning text-dark shadow-sm">Chờ thanh toán</span>
                              )}
                            </div>
                            
                            <div className="text-secondary small mb-2 d-flex gap-3">
                              <span><i className="bi bi-people-fill me-1"></i> {booking.guestSize} khách</span>
                              <span><i className="bi bi-clock-fill me-1"></i> {booking.tourId?.duration || 'Đang cập nhật'}</span>
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                              <span className="text-danger fw-bold fs-5">{booking.totalPrice?.toLocaleString('vi-VN')} ₫</span>
                              
                              <span className="small text-info fw-bold fst-italic">
                                Nhấp để xem Vé QR <i className="bi bi-arrow-right-short"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL CHỈNH SỬA THÔNG TIN ================= */}
      {showEditModal && (
        <div className="profile-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="profile-modal-box" onClick={e => e.stopPropagation()}>
            <button className="profile-modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
            <h4 className="fw-bold mb-4 text-info"><i className="bi bi-person-lines-fill me-2"></i>Chỉnh sửa hồ sơ</h4>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">Họ và Tên</label>
                <input type="text" className="form-control rounded-pill px-3 border-info" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">Số điện thoại liên lạc</label>
                <input type="tel" className="form-control rounded-pill px-3 border-info" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Email (Tài khoản đăng nhập - Không thể sửa)</label>
                <input type="email" className="form-control rounded-pill px-3 bg-light text-muted" value={user.email} disabled />
              </div>
              <button type="submit" className="btn btn-info text-white w-100 rounded-pill fw-bold shadow-sm">Cập nhật thông tin</button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL ĐỔI MẬT KHẨU ================= */}
      {showPasswordModal && (
        <div className="profile-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="profile-modal-box" onClick={e => e.stopPropagation()}>
            <button className="profile-modal-close" onClick={() => setShowPasswordModal(false)}>&times;</button>
            <h4 className="fw-bold mb-4 text-warning"><i className="bi bi-shield-lock-fill me-2"></i>Đổi mật khẩu</h4>
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">Mật khẩu hiện tại</label>
                <input type="password" className="form-control rounded-pill px-3 border-warning" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">Mật khẩu mới</label>
                <input type="password" className="form-control rounded-pill px-3 border-warning" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} required minLength="6" />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">Xác nhận mật khẩu mới</label>
                <input type="password" className="form-control rounded-pill px-3 border-warning" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required minLength="6" />
              </div>
              <button type="submit" className="btn btn-warning text-dark w-100 rounded-pill fw-bold shadow-sm">Xác nhận đổi mật khẩu</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Account;