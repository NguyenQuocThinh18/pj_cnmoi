/*
 * MyBookings.jsx
 * Trang danh sách đơn đặt tour của người dùng.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import TicketModal from '../components/TicketModal';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy thông tin user an toàn
  const user = JSON.parse(localStorage.getItem('user'));

  // --- STATE QUẢN LÝ MODAL VÉ ---
  const [showTicket, setShowTicket] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        // Kiểm tra nếu không có user thì không gọi API để tránh lỗi 401/500
        if (!user?._id && !user?.id) {
          setLoading(false);
          return;
        }

        const userId = user._id || user.id;
        const res = await axios.get(`${API_BASE_URL}/api/bookings/user/${userId}`);
        
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử đặt tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []); // Chỉ chạy 1 lần khi component mount

  // Hàm mở Modal vé
  const handleViewTicket = (booking) => {
    if (!booking.tourId) {
      alert("Thông tin tour không tồn tại!");
      return;
    }
    setSelectedBooking(booking);
    setShowTicket(true);
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="spinner-border text-info" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container py-5 mt-5" style={{ minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <i className="bi bi-clock-history text-info me-2"></i>LỊCH SỬ ĐẶT TOUR
        </h2>
        <span className="badge bg-light text-dark border">Tổng số: {bookings.length} đơn</span>
      </div>
      
      <div className="table-responsive bg-white shadow-sm rounded-4 p-3 border">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="py-3 ps-3">Tên Tour</th>
              <th className="py-3 text-center">Số người</th>
              <th className="py-3">Tổng tiền</th>
              <th className="py-3 text-center">Trạng thái</th>
              <th className="py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map(b => (
                <tr key={b._id}>
                  <td className="ps-3">
                    <div className="fw-bold text-dark">{b.tourId?.title || "Tour đã bị xóa hoặc không tồn tại"}</div>
                    <small className="text-muted">Mã đơn: #{b._id.substring(0,8).toUpperCase()}</small>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-light text-dark border-secondary-subtle">{b.guestSize} khách</span>
                  </td>
                  <td>
                    <span className="text-danger fw-bold">{b.totalPrice?.toLocaleString()} ₫</span>
                  </td>
                  <td className="text-center">
                    <span className={`badge rounded-pill px-3 py-2 ${b.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {b.status === 'paid' ? (
                        <><i className="bi bi-check-circle-fill me-1"></i> Đã thanh toán</>
                      ) : (
                        <><i className="bi bi-hourglass-split me-1"></i> Chờ xác nhận</>
                      )}
                    </span>
                  </td>
                  <td className="text-center">
                    {b.status === 'paid' ? (
                      <button 
                        className="btn btn-info btn-sm text-white rounded-pill px-3 fw-bold shadow-sm"
                        onClick={() => handleViewTicket(b)}
                      >
                        <i className="bi bi-qr-code-scan me-1"></i> XEM VÉ
                      </button>
                    ) : (
                      <button className="btn btn-light btn-sm rounded-pill px-3 disabled text-muted border">
                        Chưa có vé
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <i className="bi bi-inbox display-4 d-block mb-2"></i>
                  Bạn chưa có lịch sử đặt tour nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL VÉ --- */}
      <TicketModal 
        show={showTicket} 
        onHide={() => setShowTicket(false)} 
        booking={selectedBooking} 
        tourData={selectedBooking?.tourId} 
      />
    </div>
  );
}

export default MyBookings;