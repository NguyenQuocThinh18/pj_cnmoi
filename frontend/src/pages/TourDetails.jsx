/*
 * TourDetails.jsx
 * Trang hiển thị chi tiết một tour du lịch.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../utils/imagePath';
import Swal from 'sweetalert2'; // Dùng thông báo xịn

// --- IMPORT THƯ VIỆN BẢN ĐỒ ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix lỗi mất icon mặc định của Leaflet khi dùng với React/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function TourDetails() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [seatStats, setSeatStats] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [guestSize, setGuestSize] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  // --- STATE CHO ĐÁNH GIÁ ---
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const resolveId = (slugParam, idParam) => {
    if (idParam && idParam.match(/^[0-9a-fA-F]{24}$/)) return idParam;
    if (!slugParam) return null;
    let cleaned = slugParam.replace(/\.html$/i, '');
    let parts = cleaned.split('-');
    let maybeId = parts[parts.length - 1];
    return maybeId.match(/^[0-9a-fA-F]{24}$/) ? maybeId : null;
  };
  const tourId = resolveId(slug, id);

  useEffect(() => {
    const fetchData = async () => {
      if (!tourId) {
        setLoading(false);
        setTour(null);
        return;
      }
      try {
        const [tourRes, reviewRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/tours/${tourId}`),
          axios.get(`${API_BASE_URL}/api/reviews/${tourId}`)
        ]);

        if (tourRes.data && tourRes.data.success) {
          setTour(tourRes.data.data);
          setSeatStats(tourRes.data.seatStats); 
        } else if (tourRes.data) {
          setTour(tourRes.data);
        }

        if (reviewRes.data && reviewRes.data.success) {
          setReviews(reviewRes.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tourId]);

  // ĐÃ FIX: Truyền tải đầy đủ thông tin liên hệ lên API khi đặt tour để đồng bộ với trang cá nhân
  const handleBooking = async () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      Swal.fire('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để tiến hành đặt tour!', 'warning');
      navigate('/login');
      return;
    }
    const user = JSON.parse(userString);
    setBookingLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/bookings`, {
        tourId: tour._id,
        userId: user._id || user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        guestSize: guestSize,
        totalPrice: tour.price * guestSize
      });
      if (res.data.success) {
        navigate(`/payment/${res.data.data._id}`, { state: { booking: res.data.data, tourData: tour } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Có lỗi xảy ra khi đặt tour. Vui lòng thử lại sau.';
      console.error('Lỗi đặt tour:', err.response?.data || err);
      Swal.fire('Lỗi', errorMessage, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  // --- XỬ LÝ GỬI ĐÁNH GIÁ ---
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const userString = localStorage.getItem('user');
    if (!userString) {
      Swal.fire('Thông báo', 'Vui lòng đăng nhập để để lại đánh giá!', 'info');
      navigate('/login');
      return;
    }
    const user = JSON.parse(userString);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/reviews`, {
        tourId: tour._id,
        userId: user.id || user._id,
        rating,
        comment
      });
      
      if(res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Cảm ơn bạn!',
            text: 'Đánh giá của bạn đã được ghi nhận.',
            timer: 2000,
            showConfirmButton: false
          });
          setReviews([res.data.data, ...reviews]);
          setComment('');
          setRating(5);
      }
    } catch (err) {
      Swal.fire('Lỗi', 'Không thể gửi đánh giá lúc này.', 'error');
    }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-light"><div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }}></div></div>;
  if (!tour) return <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light"><h2 className="fw-bold text-secondary">Không tìm thấy thông tin Tour</h2><Link to="/tour-trong-nuoc" className="btn btn-info text-white mt-3 rounded-pill px-4">Quay lại danh sách</Link></div>;

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
      <style>
        {`
          .sticky-booking { position: sticky; top: 5px; z-index: 10; }
          .tour-image-banner { width: 100%; height: 450px; object-fit: cover; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .guest-btn { width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid #dee2e6; background: white; color: #495057; font-weight: bold; transition: all 0.2s; }
          .guest-btn:hover:not(:disabled) { background: #0dcaf0; color: white; border-color: #0dcaf0; }
          .guest-btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .star-active { color: #ffc107; cursor: pointer; transition: 0.2s; }
          .star-inactive { color: #dee2e6; cursor: pointer; transition: 0.2s; }
          .review-avatar { width: 45px; height: 45px; min-width: 45px; background: #0dcaf0; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(13,202,240,0.2); }
          
          .map-container { height: 350px; width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid #dee2e6; z-index: 1; }
          .leaflet-container { z-index: 1 !important; }
        `}
      </style>

      <div className="container">
        <nav aria-label="breadcrumb" className="mb-3 mt-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-info">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/tour-trong-nuoc" className="text-decoration-none text-info">Tour trong nước</Link></li>
            <li className="breadcrumb-item active">{tour.city}</li>
          </ol>
        </nav>

        <h1 className="fw-bold text-dark mb-4 lh-base" style={{ fontSize: '2.2rem' }}>{tour.title}</h1>

        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-8">
            <img src={resolveImageUrl(tour.image)} alt={tour.title} className="tour-image-banner mb-4" />

            <div className="row g-3 mb-4 text-center">
              <div className="col-6 col-md-3"><div className="bg-white p-3 rounded-4 shadow-sm border h-100"><i className="bi bi-calendar-event fs-2 text-info"></i><small className="text-muted d-block">Khởi hành</small><strong>{tour.startDate || 'Hàng ngày'}</strong></div></div>
              <div className="col-6 col-md-3"><div className="bg-white p-3 rounded-4 shadow-sm border h-100"><i className="bi bi-clock-history fs-2 text-primary"></i><small className="text-muted d-block">Thời lượng</small><strong>{tour.duration}</strong></div></div>
              <div className="col-6 col-md-3"><div className="bg-white p-3 rounded-4 shadow-sm border h-100"><i className="bi bi-geo-alt fs-2 text-danger"></i><small className="text-muted d-block">Địa điểm</small><strong>{tour.city}</strong></div></div>
              <div className="col-6 col-md-3"><div className="bg-white p-3 rounded-4 shadow-sm border h-100"><i className="bi bi-bus-front fs-2 text-warning"></i><small className="text-muted d-block">Phương tiện</small><strong>Ô tô, Thuyền</strong></div></div>
            </div>

            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
              <h4 className="fw-bold border-bottom pb-3 mb-4"><i className="bi bi-info-circle-fill text-info me-2"></i> Tổng quan chuyến đi</h4>
              <p className="text-secondary lh-lg">{tour.description || `Khám phá vùng đất ${tour.city} cùng Du Lịch Việt với những trải nghiệm tuyệt vời nhất.`}</p>
            </div>

            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
              <h4 className="fw-bold border-bottom pb-3 mb-4"><i className="bi bi-map-fill text-danger me-2"></i> Vị trí trên bản đồ</h4>
              <div className="map-container">
                <MapContainer 
                  center={[tour?.lat || 10.762622, tour?.lng || 106.660172]} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  style={{height: '100%', width: '100%'}}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[tour?.lat || 10.762622, tour?.lng || 106.660172]}>
                    <Popup>
                      <div className="text-center">
                        <strong className="text-info">{tour?.title}</strong> <br/>
                        Điểm đến: {tour?.city}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <small className="text-muted mt-2 d-block fst-italic">* Bản đồ minh họa vị trí tương đối của điểm đến.</small>
            </div>

            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4">
              <h4 className="fw-bold border-bottom pb-3 mb-4"><i className="bi bi-star-fill text-warning me-2"></i> Đánh giá khách hàng ({reviews.length})</h4>
              
              <div className="bg-light p-4 rounded-4 mb-5 border">
                <h6 className="fw-bold mb-3">Chia sẻ trải nghiệm của bạn</h6>
                <div className="mb-3 fs-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star}
                      className={`bi bi-star-fill me-1 ${star <= (hover || rating) ? 'star-active' : 'star-inactive'}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    ></i>
                  ))}
                </div>
                <form onSubmit={handleReviewSubmit}>
                  <textarea 
                    className="form-control border-0 shadow-sm mb-3" 
                    rows="3" 
                    placeholder="Chuyến đi của bạn thế nào? Hãy chia sẻ cho mọi người cùng biết nhé..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-info text-white rounded-pill px-4 fw-bold shadow-sm">GỬI ĐÁNH GIÁ</button>
                </form>
              </div>

              <div className="review-list">
                {reviews.map((rev) => (
                  <div key={rev._id} className="d-flex mb-4 pb-4 border-bottom animation-fade-in">
                    <div className="review-avatar">
                      {rev.userId?.name?.charAt(0).toUpperCase() || 'K'}
                    </div>
                    <div className="ms-3 flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div>
                            <h6 className="fw-bold mb-0 text-dark">{rev.userId?.name || rev.name || 'Khách vãng lai'}</h6>
                            <div className="text-warning small mt-1">
                                {[...Array(5)].map((_, i) => (<i key={i} className={`bi bi-star${i < rev.rating ? '-fill' : ''} me-1`}></i>))}
                            </div>
                        </div>
                        <small className="text-muted" style={{fontSize:'11px'}}>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</small>
                      </div>
                      <p className="text-secondary small mb-0 mt-2" style={{lineHeight: '1.6'}}>{rev.comment}</p>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-center text-muted fst-italic py-4">Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ trải nghiệm!</p>}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            {seatStats && (
              <div className="card border-0 shadow-sm rounded-4 mb-4 p-4 bg-white border-top border-info border-4">
                <h6 className="fw-bold mb-3 border-bottom pb-2">
                  <i className="bi bi-pie-chart-fill text-info me-2"></i> Tình trạng chỗ ngồi
                </h6>
                
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Tổng số chỗ:</span>
                  <span className="fw-bold">{seatStats.total}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Đã xác nhận:</span>
                  <span className="text-success fw-bold">{seatStats.paid}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted small">Đang giữ chỗ:</span>
                  <span className="text-warning fw-bold">{seatStats.pending}</span>
                </div>

                <div className="progress mb-3 rounded-pill" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${(seatStats.paid / seatStats.total) * 100}%` }}></div>
                  <div className="progress-bar bg-warning" style={{ width: `${(seatStats.pending / seatStats.total) * 100}%` }}></div>
                </div>

                <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 border">
                  <span className="fw-bold text-secondary">Còn trống:</span>
                  <span className={`fw-bold fs-4 ${seatStats.remaining > 0 ? 'text-primary' : 'text-danger'}`}>
                    {seatStats.remaining === 0 ? 'HẾT CHỖ' : seatStats.remaining}
                  </span>
                </div>
              </div>
            )}

            <div className="card border-0 shadow-lg rounded-4 sticky-booking overflow-hidden">
              <div className="p-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #007bff 100%)' }}>
                <h5 className="mb-1 opacity-75 small fw-bold">GIÁ TRỌN GÓI</h5>
                <h2 className="fw-bold mb-0">{tour.price?.toLocaleString('vi-VN')} ₫</h2>
                <small className="opacity-75">/ 1 Hành khách</small>
              </div>
              <div className="card-body p-4 bg-white">
                <label className="fw-bold text-dark mb-3 small">SỐ LƯỢNG HÀNH KHÁCH</label>
                <div className="d-flex align-items-center justify-content-between bg-light rounded-pill p-2 border mb-4">
                  <button className="guest-btn" onClick={() => setGuestSize(p => p > 1 ? p - 1 : 1)} disabled={seatStats?.remaining === 0}><i className="bi bi-dash"></i></button>
                  <span className="fw-bold fs-5">{guestSize}</span>
                  <button className="guest-btn" onClick={() => setGuestSize(p => p < (seatStats?.remaining || 20) ? p + 1 : p)} disabled={seatStats?.remaining === 0 || guestSize >= seatStats?.remaining}><i className="bi bi-plus"></i></button>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold text-secondary small">TỔNG CỘNG:</span>
                  <span className="fw-bold text-danger fs-3">{(tour.price * guestSize).toLocaleString('vi-VN')} ₫</span>
                </div>
                <button 
                  onClick={handleBooking} 
                  disabled={bookingLoading || (seatStats && seatStats.remaining === 0)} 
                  className={`btn ${seatStats?.remaining === 0 ? 'btn-secondary' : 'btn-danger'} w-100 rounded-pill py-3 fw-bold shadow-sm fs-5`}
                >
                  {bookingLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-cart-check-fill me-2"></i>}
                  {seatStats?.remaining === 0 ? 'TẠM HẾT CHỖ' : 'ĐẶT TOUR NGAY'}
                </button>
                <p className="text-center text-muted small mt-3 mb-0"><i className="bi bi-shield-lock me-1"></i> Thanh toán an toàn qua VNPAY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourDetails;