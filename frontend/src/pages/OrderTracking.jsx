/*
 * OrderTracking.jsx
 * Trang tra cứu đơn đặt tour.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';

function OrderTracking() {
  const [searchType, setSearchType] = useState('code');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setError('');
    setOrderResult(null);

    try {
      // Vệ sinh sạch sẽ dấu # và khoảng trắng trước khi gửi đi
      const cleanValue = searchValue.replace(/#/g, '').trim();
      
      // Gửi đi bằng tham số an toàn
      const queryParam = searchType === 'code' ? `code=${cleanValue}` : `phone=${cleanValue}`;
      const res = await axios.get(`${API_BASE_URL}/api/bookings/track?${queryParam}`);
      
      if (res.data.success && res.data.data.length > 0) {
        setOrderResult(res.data.data[0]);
      }
    } catch (err) {
      // Bảng đỏ sẽ in ra chính xác lỗi từ Backend để bắt bệnh
      setError(err.response?.data?.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-relative min-vh-100 d-flex align-items-center py-5" style={{
        backgroundImage: 'linear-gradient(rgba(240, 248, 255, 0.9), rgba(240, 248, 255, 0.9)), url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }}>
      <div className="container position-relative z-1" style={{ marginTop: '50px' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7">
            
            <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
              
              <div className="p-4 p-md-5 text-white text-center position-relative" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}>
                 <div className="bg-white bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                   <i className="bi bi-search fs-3"></i>
                 </div>
                 <h2 className="fw-bold mb-2">Tra cứu đơn hàng</h2>
                 <p className="text-white-50 mb-0">Theo dõi trạng thái lịch trình và thông tin thanh toán của bạn</p>
              </div>

              <div className="card-body p-4 p-md-5 bg-white">
                
                <div className="d-flex justify-content-center gap-3 mb-4">
                  <button 
                    className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${searchType === 'code' ? 'btn-primary shadow' : 'bg-light text-secondary border hover-bg-secondary'}`}
                    onClick={() => { setSearchType('code'); setSearchValue(''); setError(''); setOrderResult(null); }}
                  >
                    <i className="bi bi-hash me-1"></i> Mã đơn
                  </button>
                  <button 
                    className={`btn rounded-pill px-4 py-2 fw-bold transition-all ${searchType === 'phone' ? 'btn-primary shadow' : 'bg-light text-secondary border hover-bg-secondary'}`}
                    onClick={() => { setSearchType('phone'); setSearchValue(''); setError(''); setOrderResult(null); }}
                  >
                    <i className="bi bi-telephone me-1"></i> Số điện thoại
                  </button>
                </div>

                <form onSubmit={handleTrackOrder}>
                  <div className="p-1 bg-white border rounded-pill shadow-sm d-flex align-items-center transition-all hover-shadow">
                    <span className="ps-4 text-primary border-0 bg-transparent">
                      {searchType === 'code' ? <i className="bi bi-upc-scan fs-4"></i> : <i className="bi bi-telephone fs-4"></i>}
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-0 shadow-none bg-transparent px-3 py-3 fs-6" 
                      placeholder={searchType === 'code' ? 'Nhập Mã đơn (ví dụ: 65f1a2)' : 'Nhập số điện thoại đặt tour'} 
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      required
                    />
                    <button 
                      className="btn btn-primary rounded-pill px-4 px-md-5 py-3 fw-bold shadow-sm" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Tra cứu ngay'}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="alert alert-danger mt-4 border-0 rounded-4 d-flex align-items-center shadow-sm animation-fade-in">
                    <i className="bi bi-exclamation-octagon-fill fs-4 me-3 text-danger"></i> 
                    <div>{error}</div>
                  </div>
                )}

                <div className="text-center mt-4">
                  <p className="text-muted small mb-0">Bạn cần hỗ trợ? <Link to="/lien-he" className="text-primary text-decoration-none fw-bold">Liên hệ với Du Lịch Việt</Link></p>
                </div>

              </div>
            </div>

            {/* --- KẾT QUẢ ĐƠN HÀNG TRẢ VỀ --- */}
            {orderResult && (
              <div className="card border-0 shadow-lg rounded-5 overflow-hidden mt-4 animation-fade-in">
                <div className="bg-success p-3 text-white text-center fw-bold d-flex justify-content-center align-items-center" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <i className="bi bi-check-circle-fill fs-5 me-2"></i> TÌM THẤY ĐƠN HÀNG CỦA BẠN 
                  {searchType === 'phone' && ' (MỚI NHẤT)'}
                </div>
                
                <div className="card-body p-4 p-md-5">
                  <div className="row align-items-center">
                    <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
                      <img 
                        src={orderResult.tourId?.image || "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500&q=80"} 
                        className="img-fluid rounded-4 shadow" 
                        style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
                        alt="Tour"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80'; }}
                      />
                    </div>
                    
                    <div className="col-md-8 ps-md-4">
                      <div className="d-flex flex-wrap justify-content-between align-items-start mb-3 gap-2">
                        <h4 className="fw-bold text-dark mb-0">{orderResult.tourId?.title || 'Tour không xác định'}</h4>
                        <span className={`badge rounded-pill px-3 py-2 fs-6 shadow-sm ${orderResult.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {orderResult.status === 'paid' ? <><i className="bi bi-shield-check me-1"></i> Đã thanh toán</> : <><i className="bi bi-hourglass-split me-1"></i> Chờ thanh toán</>}
                        </span>
                      </div>
                      
                      <div className="bg-light rounded-4 p-3 mb-4 border">
                        <div className="row text-secondary">
                          <div className="col-6 mb-2">
                            <small className="text-muted d-block">Mã Booking</small>
                            <strong className="text-dark fs-6">#{orderResult._id.substring(0, 8).toUpperCase()}</strong>
                          </div>
                          <div className="col-6 mb-2">
                            <small className="text-muted d-block">Số lượng khách</small>
                            <strong className="text-dark fs-6"><i className="bi bi-people-fill me-1 text-info"></i> {orderResult.guestSize} người</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Thời lượng</small>
                            <strong className="text-dark fs-6"><i className="bi bi-calendar-event me-1 text-info"></i> {orderResult.tourId?.duration || 'Đang cập nhật'}</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Tổng hóa đơn</small>
                            <strong className="text-danger fs-5">{orderResult.totalPrice?.toLocaleString('vi-VN')} ₫</strong>
                          </div>
                        </div>
                      </div>

                      {orderResult.status !== 'paid' && (
                        <div className="text-end">
                          <Link to={`/payment/${orderResult._id}`} className="btn btn-danger rounded-pill px-5 py-2 fw-bold shadow hover-scale transition-all">
                            Thanh toán ngay <i className="bi bi-arrow-right ms-2"></i>
                          </Link>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;