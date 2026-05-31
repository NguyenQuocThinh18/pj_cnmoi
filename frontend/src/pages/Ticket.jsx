/*
 * Ticket.jsx
 * Trang vé điện tử / QR check-in.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';

function Ticket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const userString = localStorage.getItem('user');
        let foundTicket = null;

        if (userString) {
          const currentUser = JSON.parse(userString);
          const res = await axios.get(`${API_BASE_URL}/api/bookings/user/${currentUser._id}`);
          if (res.data.success) {
            foundTicket = res.data.data.find(b => b._id === id);
          }
        }

        if (!foundTicket) {
          const trackRes = await axios.get(`${API_BASE_URL}/api/bookings/track?code=${id}`);
          if (trackRes.data.success && trackRes.data.data.length > 0) {
            foundTicket = trackRes.data.data[0];
          }
        }

        setBooking(foundTicket);
      } catch (error) {
        console.error("Lỗi tải vé điện tử:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id]);

  const handlePrintTicket = () => {
    window.print();
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-light"><div className="spinner-border text-info" style={{width: '3rem', height: '3rem'}}></div></div>;
  
  if (!booking) return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <i className="bi bi-ticket-detailed text-muted mb-3" style={{ fontSize: '5rem' }}></i>
      <h3 className="fw-bold text-dark">Không tìm thấy dữ liệu vé!</h3>
      <button className="btn btn-info text-white mt-3 rounded-pill px-5 fw-bold shadow-sm" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-2"></i>Quay lại
      </button>
    </div>
  );

  return (
    <div className="bg-light py-5 ticket-page-wrapper" style={{ minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .ticket-container {
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          display: table;
          border-collapse: separate;
          overflow: hidden;
        }
        
        .ticket-main {
          display: table-cell;
          width: 68%;
          background-color: #56c6e1;
          color: white;
          padding: 40px;
          vertical-align: top;
        }
        
        .ticket-divider {
          display: table-cell;
          width: 4px;
          position: relative;
          background-color: white;
          vertical-align: top;
        }
        
        .ticket-notch-top {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 36px;
          background-color: #f8f9fa;
          border-radius: 50%;
          z-index: 2;
        }
        
        .ticket-notch-bottom {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 36px;
          background-color: #f8f9fa;
          border-radius: 50%;
          z-index: 2;
        }
        
        .ticket-line {
          position: absolute;
          top: 20px;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 2px dashed #cbd5e1;
          z-index: 1;
        }
        
        .ticket-stub {
          display: table-cell;
          width: 32%;
          background: white;
          padding: 40px 25px;
          text-align: center;
          vertical-align: top;
        }

        @media print {
          @page { size: landscape; margin: 0; }
          body { background-color: white !important; }
          body * { visibility: hidden; }
          .ticket-container, .ticket-container * { visibility: visible; }
          .ticket-container {
            position: absolute; left: 40px; top: 40px;
            width: 90% !important; max-width: 90% !important;
            box-shadow: none !important;
            border: 1px dashed #56c6e1 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .ticket-main { background-color: #56c6e1 !important; color: white !important; }
          .ticket-notch-top, .ticket-notch-bottom { background-color: white !important; }
          .no-print { display: none !important; }
        }
        
        @media (max-width: 768px) {
          .ticket-container { display: block; max-width: 420px; margin: 0 auto; }
          .ticket-main, .ticket-stub, .ticket-divider { display: block; width: 100%; }
          .ticket-divider { height: 40px; }
          .ticket-notch-top { top: 50%; left: -18px; transform: translateY(-50%); }
          .ticket-notch-bottom { top: 50%; right: -18px; left: auto; transform: translateY(-50%); }
          .ticket-line { top: 50%; left: 20px; right: 20px; bottom: auto; width: auto; border-top: 2px dashed #dee2e6; border-left: none; transform: translateY(-50%); }
        }
      `}} />
      
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 no-print" style={{ maxWidth: '850px', margin: '0 auto 20px auto' }}>
          <button className="btn btn-outline-secondary rounded-pill fw-bold shadow-sm px-4" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i> Quay lại Hồ sơ
          </button>
          
          <button className="btn btn-success rounded-pill fw-bold shadow-sm px-4" onClick={handlePrintTicket}>
            <i className="bi bi-printer-fill me-2"></i> IN VÉ ĐIỆN TỬ
          </button>
        </div>

        <div className="d-flex justify-content-center">
          <div className="ticket-container">
            
            <div className="ticket-main">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-white border-opacity-25 pb-3">
                <div className="d-flex align-items-center gap-2 text-uppercase fw-bold fs-4" style={{ letterSpacing: '2px' }}>
                  {/* Thay máy bay bằng chữ Du Lịch Việt xịn sò */}
                  <span>DU LỊCH VIỆT</span>
                </div>
                <span className="badge bg-white text-info rounded-pill px-3 py-2 fw-bold shadow-sm" style={{ fontSize: '0.75rem' }}>
                  {booking.status === 'paid' ? '🎫 VÉ HỢP LỆ' : '⏳ CHỜ DUYỆT'}
                </span>
              </div>
              
              <h3 className="fw-bold mb-4 lh-base text-uppercase" style={{ letterSpacing: '0.5px' }}>
                {booking.tourId?.title || 'Chuyến đi hành trình Việt'}
              </h3>
              
              <div className="row g-4">
                <div className="col-6">
                  <span className="d-block mb-1 opacity-75 small text-uppercase" style={{ letterSpacing: '0.5px' }}>Khách hàng / Passenger</span>
                  <strong className="fs-6 d-block text-truncate text-warning">{booking.userId?.name || booking.name || 'Khách vãng lai'}</strong>
                </div>
                <div className="col-6">
                  <span className="d-block mb-1 opacity-75 small text-uppercase" style={{ letterSpacing: '0.5px' }}>Số lượng / Quantity</span>
                  <strong className="fs-6 d-block">{booking.guestSize} Người</strong>
                </div>
                <div className="col-6">
                  <span className="d-block mb-1 opacity-75 small text-uppercase" style={{ letterSpacing: '0.5px' }}>Ngày giờ xuất / Date Time</span>
                  <strong className="fs-6 d-block">
                    {new Date(booking.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                  </strong>
                </div>
                <div className="col-6">
                  <span className="d-block mb-1 opacity-75 small text-uppercase" style={{ letterSpacing: '0.5px' }}>Tổng tiền / Total Price</span>
                  <strong className="fs-5 d-block text-white fw-bold">{booking.totalPrice?.toLocaleString('vi-VN')} ₫</strong>
                </div>
              </div>
            </div>

            <div className="ticket-divider">
              <div className="ticket-notch-top"></div>
              <div className="ticket-notch-bottom"></div>
              <div className="ticket-line"></div>
            </div>

            <div className="ticket-stub">
              <div className="text-secondary small fw-bold text-uppercase mb-3" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>
                MÃ QR CHECK-IN
              </div>
              
              <div className="p-2 border rounded-4 d-inline-block shadow-sm mb-3 bg-white">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking._id}&margin=10`} 
                  alt="QR Code" 
                  style={{ width: '140px', height: '140px', objectFit: 'contain' }}
                />
              </div>
              
              <h4 className="fw-bold text-dark mb-0 font-monospace" style={{ letterSpacing: '3px' }}>
                {String(booking._id).substring(18).toUpperCase()}
              </h4>
              <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '600' }}>MÃ ĐƠN HÀNG</div>
              
              <div className="mt-4 pt-3 border-top text-start px-2">
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>Tình trạng:</div>
                <span className={`fw-bold small ${booking.status === 'paid' ? 'text-success' : 'text-danger'}`}>
                  ● {booking.status === 'paid' ? 'Đã kích hoạt vé' : 'Chờ xác nhận'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;