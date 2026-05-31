/*
 * PaymentSandbox.jsx
 * Trang thanh toán giả lập.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../utils/imagePath';
import Swal from 'sweetalert2'; // <-- IMPORT THƯ VIỆN THÔNG BÁO XỊN

function PaymentSandbox() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showQrInfo, setShowQrInfo] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', notes: '', paymentRate: '100', paymentMethod: 'vnpay',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setFormData(prev => ({
        ...prev,
        name: user.name || '', email: user.email || '', phone: user.phone || ''
      }));
    }

    const fetchBooking = async () => {
      if (location.state && location.state.booking && location.state.tourData) {
        setBooking({
          ...location.state.booking,
          tourId: location.state.tourData
        });
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings/track?code=${bookingId}`);
        if (res.data.success && res.data.data.length > 0) {
          setBooking(res.data.data[0]);
        } else {
          throw new Error("Không tìm thấy");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin đơn hàng:", error);
        // SỬ DỤNG SWAL THAY CHO ALERT
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không tìm thấy đơn hàng. Đang quay lại trang chủ...',
          timer: 2000,
          showConfirmButton: false
        }).then(() => navigate('/'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [bookingId, navigate, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.phone || !formData.email) {
      Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng điền đầy đủ thông tin liên hệ bắt buộc (*)' });
      return;
    }
    if (!termsAccepted) {
      Swal.fire({ icon: 'warning', title: 'Chưa đồng ý', text: 'Vui lòng đồng ý với Điều khoản và Chính sách bảo mật.' });
      return;
    }

    if (formData.paymentMethod === 'vnpay') {
      setProcessing(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/api/payment/create_payment_url`, {
          bookingId: booking._id,
          amount: booking.totalPrice,
          bankCode: 'NCB'
        });
        if (res.data.success) {
          window.location.href = res.data.paymentUrl;
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Lỗi kết nối', text: 'Không thể kết nối cổng thanh toán VNPAY!' });
        setProcessing(false);
      }
      return;
    }

    if (formData.paymentMethod === 'bank') {
      setShowQrInfo(true);
      window.scrollTo(0, 0); 
      return;
    }

    executePaymentAPI();
  };

  const executePaymentAPI = async () => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await axios.put(`${API_BASE_URL}/api/bookings/${bookingId}/pay`, {
        paymentMethod: formData.paymentMethod
      });
      
      if (res.data.success) {
        if (formData.paymentMethod === 'cash') {
          Swal.fire({
            icon: 'success',
            title: 'Đặt tour thành công!',
            text: 'Trạng thái: Chờ xác nhận. Vui lòng đến văn phòng của chúng tôi để hoàn tất thanh toán nhé.',
            confirmButtonColor: '#0dcaf0'
          }).then(() => navigate('/'));
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Đã chuyển khoản!',
            text: 'Hệ thống sẽ kiểm tra và xác nhận đơn hàng trong giây lát. Cảm ơn bạn!',
            confirmButtonColor: '#0dcaf0'
          }).then(() => navigate('/'));      
        }    
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Thất bại', text: 'Lỗi khi xử lý đơn hàng. Vui lòng thử lại sau.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelBooking = async () => {
    // SỬ DỤNG SWAL XÁC NHẬN HỦY
    Swal.fire({
      title: 'Bạn chắc chắn muốn hủy?',
      text: "Chỗ đã giữ của bạn sẽ được hoàn trả vào hệ thống!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Đồng ý hủy',
      cancelButtonText: 'Không'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setProcessing(true);
        try {
          await axios.put(`${API_BASE_URL}/api/bookings/${bookingId}`, { status: 'cancelled' });
          Swal.fire({ icon: 'success', title: 'Đã hủy!', text: 'Đã hủy đơn đặt tour và hoàn trả chỗ thành công.', timer: 2000, showConfirmButton: false });
          navigate(-1); 
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Có lỗi xảy ra khi hủy đơn!' });
        } finally {
          setProcessing(false);
        }
      }
    });
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center bg-light"><div className="spinner-border text-primary"></div></div>;
  if (!booking) return null;

  const totalPrice = booking.totalPrice || 0;
  const beneficiaryAccount = '24315887';
  const beneficiaryBankCode = 'acb';
  const beneficiaryName = 'CONG TY TNHH DU LICH VIET';
  const orderContent = `DLV ${booking._id.substring(0,6).toUpperCase()}`;

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
      {/* ... (Toàn bộ phần giao diện return bên dưới giữ nguyên y hệt file cũ của bạn, bạn giữ lại nhé) ... */}
      <style>
        {`
          .step-container { position: relative; display: flex; justify-content: space-between; align-items: center; max-width: 600px; margin: 0 auto; }
          .step-container::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: #e0e0e0; z-index: 1; transform: translateY(-50%); }
          .step-item { position: relative; z-index: 2; display: flex; align-items: center; gap: 8px; background: #f8f9fa; padding: 0 15px; }
          .step-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
          .step-done .step-circle { background: #0dcaf0; color: white; }
          .step-active .step-circle { background: #fd7e14; color: white; }
          .step-pending .step-circle { background: white; color: #adb5bd; border: 2px solid #e0e0e0; }
          
          .payment-card { border: 1px solid #e9ecef; border-radius: 12px; background: white; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); overflow: hidden; }
          .payment-card-header { padding: 16px 20px; border-bottom: 1px solid #f1f3f5; font-weight: bold; color: #1e40af; display: flex; align-items: center; gap: 10px; }
          .payment-card-body { padding: 24px; }
          
          .radio-box { border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; cursor: pointer; transition: all 0.2s; display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px; }
          .radio-box:hover { border-color: #0dcaf0; background: #f8f9fa; }
          .radio-box.active { border-color: #fd7e14; background: #fff5eb; box-shadow: 0 0 0 1px #fd7e14; }
          .radio-box input[type="radio"] { margin-top: 4px; accent-color: #fd7e14; }
          
          .sticky-summary { position: sticky; top: 75px; }
        `}
      </style>

      <div className="container mt-4">
        
        <div className="step-container mb-5 text-muted small fw-bold">
          <div className="step-item step-done"><div className="step-circle"><i className="bi bi-check"></i></div><span className="text-dark">Chọn tour</span></div>
          <div className="step-item step-active"><div className="step-circle">2</div><span className="text-dark">Điền thông tin</span></div>
          <div className="step-item step-pending"><div className="step-circle">3</div><span>Thanh toán</span></div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            
            <div className="payment-card">
              <div className="payment-card-header bg-white"><div style={{width:'8px', height:'8px', background:'#0dcaf0', borderRadius:'50%'}}></div> Thông tin tour</div>
              <div className="payment-card-body">
                <div className="d-flex align-items-center gap-4">
                  <img 
                    src={resolveImageUrl(booking.tourId?.image) || "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=200&q=80"} 
                    alt="Tour" 
                    className="rounded-3" 
                    style={{width: '100px', height: '100px', objectFit: 'cover'}} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=200&q=80'; }}
                  />
                  <div>
                    <h5 className="fw-bold text-dark mb-2">{booking.tourId?.title || 'Tour du lịch'}</h5>
                    <div className="text-muted small">
                      <span className="badge bg-warning text-dark me-2">Mã Đơn: #{booking._id.substring(0,6).toUpperCase()}</span>
                      <i className="bi bi-calendar3 me-1"></i> Thời lượng: {booking.tourId?.duration || 'Đang cập nhật'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-card">
              <div className="payment-card-header bg-white"><div style={{width:'8px', height:'8px', background:'#fd7e14', borderRadius:'50%'}}></div> Điểm đón khách</div>
              <div className="payment-card-body py-3">
                <p className="mb-1 text-muted small">Địa chỉ điểm đón</p>
                <p className="fw-bold text-dark mb-0"><i className="bi bi-geo-alt-fill text-danger me-2"></i>12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM</p>
              </div>
            </div>

            <div className="payment-card">
              <div className="payment-card-header bg-white d-flex justify-content-between w-100">
                <div className="d-flex align-items-center gap-2"><div style={{width:'8px', height:'8px', background:'#0dcaf0', borderRadius:'50%'}}></div> Thông tin liên hệ</div>
                <span className="text-danger small fw-normal">* Bắt buộc</span>
              </div>
              <div className="payment-card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Họ và tên *</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} placeholder="VD: Trần Minh Thái" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Số điện thoại *</label>
                    <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="VD: 0909 000 000" />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-muted">Email *</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} placeholder="VD: thaitran2706@gmail.com" />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-muted">Ghi chú (Nếu có)</label>
                    <textarea className="form-control" name="notes" value={formData.notes} onChange={handleInputChange} rows="2" placeholder="Ví dụ: Ăn chay, có trẻ nhỏ..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-card">
              <div className="payment-card-header bg-white"><div style={{width:'8px', height:'8px', background:'#fd7e14', borderRadius:'50%'}}></div> Chọn phương thức thanh toán</div>
              <div className="payment-card-body">
                
                {/* --- LỰA CHỌN VNPAY --- */}
                <label className={`radio-box w-100 ${formData.paymentMethod === 'vnpay' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="vnpay" checked={formData.paymentMethod === 'vnpay'} onChange={handleInputChange} />
                  <div className="flex-grow-1">
                    <div className="fw-bold text-primary mb-1 d-flex align-items-center">
                      <img 
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png" 
                        style={{ height: '18px', width: 'auto', objectFit: 'contain' }} 
                        className="me-2" 
                        alt="VNPay"
                        onError={(e) => { 
                          e.target.style.display = 'none'; 
                          e.target.nextSibling.style.display = 'inline-block'; 
                        }} 
                      />
                      <i className="bi bi-credit-card-fill text-primary me-2" style={{ display: 'none', fontSize: '18px' }}></i>
                      Thanh toán qua VNPAY
                    </div>
                    <small className="text-muted">Hỗ trợ thẻ ATM, Visa, MasterCard và ứng dụng ngân hàng.</small>
                  </div>
                </label>

                {/* LỰA CHỌN CHUYỂN KHOẢN (QR) */}
                <label className={`radio-box w-100 ${formData.paymentMethod === 'bank' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="bank" checked={formData.paymentMethod === 'bank'} onChange={handleInputChange} />
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark mb-1"><i className="bi bi-bank me-2 text-info"></i>Chuyển khoản thủ công (VietQR)</div>
                    <small className="text-muted">Quét mã QR để chuyển khoản. Xác nhận sau 5-10 phút.</small>
                  </div>
                </label>

                {/* LỰA CHỌN TIỀN MẶT */}
                <label className={`radio-box w-100 mb-0 ${formData.paymentMethod === 'cash' ? 'active' : ''}`}>
                  <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleInputChange} />
                  <div>
                    <div className="fw-bold text-dark mb-1"><i className="bi bi-cash-stack me-2 text-success"></i>Thanh toán tiền mặt tại văn phòng</div>
                    <small className="text-muted">12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP. HCM.</small>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="sticky-summary">
              
              {!showQrInfo ? (
                <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between mb-3 text-secondary">
                      <span>Hành khách</span><span className="fw-bold text-dark">{booking.guestSize} người</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 text-secondary">
                      <span>Tạm tính</span><span className="fw-bold text-dark">{booking.totalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <hr className="text-muted" />
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <span className="fw-bold fs-5 text-dark">Tổng cộng</span><span className="fw-bold fs-4 text-danger">{totalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="form-check mb-4">
                      <input className="form-check-input" type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                      <label className="form-check-label small text-muted" htmlFor="terms">
                        Tôi đồng ý với <Link to="/chinh-sach" className="text-info fw-bold text-decoration-none">Điều khoản</Link> và <Link to="/chinh-sach" className="text-info fw-bold text-decoration-none">Chính sách bảo mật</Link>.
                      </label>
                    </div>

                    <button 
                      onClick={handlePayment} 
                      disabled={!termsAccepted || processing}
                      className={`btn w-100 rounded-pill py-3 fw-bold shadow-sm ${termsAccepted ? 'btn-danger' : 'btn-secondary opacity-50'}`}
                    >
                      {processing ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                      {processing ? 'ĐANG XỬ LÝ...' : `XÁC NHẬN THANH TOÁN`}
                    </button>

                    <button 
                      onClick={handleCancelBooking} 
                      disabled={processing}
                      className="btn btn-outline-danger w-100 rounded-pill py-2 mt-3 fw-bold shadow-sm"
                    >
                      <i className="bi bi-x-circle me-2"></i> Hủy giao dịch & Trở lại
                    </button>

                  </div>
                </div>
              ) : (
                <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden text-center p-4">
                  <h5 className="fw-bold text-primary mb-3"><i className="bi bi-qr-code-scan me-2"></i>Quét mã thanh toán</h5>
                  
                  <div className="p-3 border rounded-4 mb-3 d-inline-block bg-white shadow-sm">
                    <img 
                      src={`https://img.vietqr.io/image/ACB-24315887-compact2.png?amount=${totalPrice}&addInfo=${encodeURIComponent(`DLV ${booking._id.substring(0,6).toUpperCase()}`)}&accountName=${encodeURIComponent('CONG TY TNHH DU LICH VIET')}`} 
                      alt="VietQR Code" 
                      className="img-fluid" 
                      style={{width: '220px'}} 
                      onError={(e) => { 
                        e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; 
                      }} 
                    />
                  </div>

                  <div className="text-start small bg-light p-3 rounded-3 mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Ngân hàng</span>
                      <span className="fw-bold">ACB</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Chủ tài khoản</span>
                      <span className="fw-bold">CÔNG TY TNHH DU LỊCH VIỆT</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Số tài khoản</span>
                      <span className="fw-bold text-primary fs-6">24315887</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Số tiền</span>
                      <span className="fw-bold text-danger fs-6">{totalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Nội dung CK</span>
                      <span className="fw-bold text-dark">DLV {booking._id.substring(0,6).toUpperCase()}</span>
                    </div>
                  </div>

                  <p className="text-muted small">Sau khi chuyển khoản thành công, hệ thống sẽ tự động xác nhận đơn hàng của bạn.</p>

                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-outline-secondary w-50 fw-bold" onClick={() => setShowQrInfo(false)} disabled={processing}>
                      Quay lại
                    </button>
                    <button className="btn btn-success w-50 fw-bold" onClick={executePaymentAPI} disabled={processing}>
                      {processing ? 'Đang lưu...' : 'Đã chuyển'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSandbox;