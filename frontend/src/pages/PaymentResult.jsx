/*
 * PaymentResult.jsx
 * Trang hiển thị kết quả thanh toán.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  
  // Lấy mã đơn hàng và số tiền từ URL để in ra biên lai
  const bookingId = searchParams.get('vnp_TxnRef');
  const amount = searchParams.get('vnp_Amount');

  useEffect(() => {
    const updatePaymentStatus = async () => {
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

      if (vnp_ResponseCode === '00') {
        try {
          await axios.post(`${API_BASE_URL}/api/payment/update-status`, {
            bookingId,
            vnp_ResponseCode
          });
          setStatus('success');
        } catch (error) {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    };

    if (searchParams.get('vnp_ResponseCode')) {
      updatePaymentStatus();
    }
  }, [searchParams, bookingId]);

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      {/* KHAI BÁO CSS DÀNH RIÊNG CHO MÁY IN */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; } /* Ẩn toàn bộ web */
            .print-container, .print-container * { visibility: visible; } /* Chỉ hiện khung biên lai */
            .print-container {
              position: absolute;
              left: 50%;
              top: 0;
              transform: translateX(-50%);
              width: 100%;
              max-width: 600px;
              box-shadow: none !important;
              border: 1px solid #ccc !important;
            }
            .d-print-none { display: none !important; } /* Giấu các nút bấm khi in */
            .d-print-block { display: block !important; } /* Hiện tiêu đề in */
            .navbar, footer { display: none !important; }
          }
        `}
      </style>

      {/* KHUNG HIỂN THỊ CHÍNH (SẼ ĐƯỢC IN RA NẾU BẤM IN) */}
      <div className="card border-0 shadow-lg p-5 text-center rounded-4 print-container" style={{maxWidth: '550px', width: '90%'}}>
        
        {/* TRẠNG THÁI ĐANG XỬ LÝ */}
        {status === 'processing' && (
          <div className="d-print-none">
            <div className="spinner-border text-info mb-4" style={{width: '3rem', height: '3rem'}}></div>
            <h4 className="fw-bold">Đang xử lý thanh toán...</h4>
            <p className="text-muted">Hệ thống đang đồng bộ dữ liệu với ngân hàng...</p>
          </div>
        )}
        
        {/* TRẠNG THÁI THÀNH CÔNG */}
        {status === 'success' && (
          <>
            {/* Header Biên lai (Chỉ hiện khi in) */}
            <div className="d-none d-print-block mb-4 text-center">
              <h2 className="fw-bold text-uppercase">Du Lịch Việt</h2>
              <p className="text-muted mb-0">Biên Lai Xác Nhận Thanh Toán</p>
              <hr />
            </div>

            <div className="d-print-none">
              <i className="bi bi-check-circle-fill text-success" style={{fontSize: '5rem'}}></i>
              <h3 className="fw-bold mt-3 text-success">Thanh Toán Thành Công!</h3>
              <p className="text-muted">Đơn hàng của bạn đã được xác nhận và thanh toán qua VNPAY.</p>
            </div>

            {/* Bảng thông tin giao dịch (Hiện cả trên web và khi in) */}
            <div className="text-start bg-white border rounded-3 p-4 mt-4 mb-4 shadow-sm">
              <h6 className="fw-bold text-uppercase border-bottom pb-2 mb-3 text-info">Thông tin giao dịch</h6>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Mã đơn hàng:</span>
                <span className="fw-bold">#{bookingId?.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Phương thức:</span>
                <span className="fw-bold">Cổng VNPAY</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Thời gian:</span>
                <span className="fw-bold">{new Date().toLocaleString('vi-VN')}</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="fw-bold">Tổng thanh toán:</span>
                <span className="fw-bold text-danger fs-5">
                  {amount ? (parseInt(amount) / 100).toLocaleString('vi-VN') : '0'} VNĐ
                </span>
              </div>
            </div>

            {/* Các nút bấm (Sẽ bị giấu khi in) */}
            <div className="d-flex justify-content-center gap-3 flex-wrap d-print-none">
              <Link to="/tai-khoan" className="btn btn-info text-white rounded-pill px-4 py-2 fw-bold shadow-sm">
                <i className="bi bi-person-lines-fill me-2"></i>Xem đơn hàng
              </Link>
              
              {/* NÚT IN BIÊN LAI */}
              <button onClick={() => window.print()} className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold shadow-sm">
                <i className="bi bi-printer-fill me-2"></i>In biên lai PDF
              </button>
            </div>
          </>
        )}
        
        {/* TRẠNG THÁI LỖI */}
        {status === 'error' && (
          <div className="d-print-none">
            <i className="bi bi-x-circle-fill text-danger" style={{fontSize: '5rem'}}></i>
            <h3 className="fw-bold mt-3 text-danger">Thanh Toán Thất Bại</h3>
            <p className="text-muted">Giao dịch đã bị hủy hoặc thẻ không đủ tiền/nhập sai OTP.</p>
            <button onClick={() => navigate('/')} className="btn btn-outline-secondary rounded-pill px-5 py-2 mt-3 fw-bold">Về trang chủ</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentResult;