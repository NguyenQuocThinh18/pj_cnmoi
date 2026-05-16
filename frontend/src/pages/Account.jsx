import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../utils/imagePath'; // ĐÃ THÊM: Import hàm fix ảnh

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra đăng nhập
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert('Bạn cần đăng nhập để xem thông tin!');
      navigate('/login');
      return;
    }
    
    const currentUser = JSON.parse(userString);
    setUser(currentUser);

    // 2. Lấy danh sách Tour đã đặt của user này
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

  if (!user) return null;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Hồ sơ cá nhân</h2>
        
        <div className="row g-4">
          {/* CỘT TRÁI: THÔNG TIN USER */}
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
                  <i className="bi bi-envelope-at me-2"></i> {user.email}
                </li>
                <li className="list-group-item bg-transparent px-0 py-3 text-secondary">
                  <i className="bi bi-telephone me-2"></i> {user.phone || 'Chưa cập nhật số điện thoại'}
                </li>
              </ul>
              
              <button onClick={handleLogout} className="btn btn-outline-danger w-100 rounded-pill fw-bold">
                <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: LỊCH SỬ ĐẶT TOUR */}
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
                    <div key={booking._id} className="card border border-light bg-light rounded-4 overflow-hidden shadow-sm">
                      <div className="row g-0 align-items-center">
                        <div className="col-md-3">
                          {/* ĐÃ FIX: Ảnh hiển thị đúng đường dẫn */}
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
                              
                              {/* ĐÃ FIX: Logic trạng thái xử lý cả pending và pending_confirmation */}
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
                              
                              {(booking.status !== 'paid' && booking.status !== 'cancelled') && (
                                <Link to={`/payment/${booking._id}`} className="btn btn-sm btn-danger rounded-pill px-3 fw-bold shadow-sm hover-scale">
                                  {booking.status === 'pending' || booking.status === 'pending_confirmation' ? 'Tiếp tục thanh toán' : 'Thanh toán ngay'} <i className="bi bi-arrow-right-short"></i>
                                </Link>
                              )}
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
    </div>
  );
}

export default Account;