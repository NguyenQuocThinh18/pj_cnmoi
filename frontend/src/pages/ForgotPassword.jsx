import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'loading', 'success'
  const [message, setMessage] = useState('');

  const simulateForgotPassword = () => {
    setStatus('success');
    setMessage(`Môi trường giả lập: Yêu cầu khôi phục mật khẩu đã được gửi đến ${email}. Bạn có thể xem thông báo này như một bước xác nhận khôi phục mật khẩu.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    setTimeout(() => {
      simulateForgotPassword();
    }, 500);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/assets/img/index/Vinh-ha-long.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <div className="card-body p-4 p-md-5">
                
                <div className="text-center mb-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '70px', height: '70px'}}>
                    <i className="bi bi-key text-info fs-1"></i>
                  </div>
                  <h3 className="fw-bold">Khôi phục mật khẩu</h3>
                  <p className="text-muted small">Nhập email bạn đã đăng ký, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.</p>
                </div>

                {status === 'success' ? (
                  <div className="text-center">
                    <div className="alert alert-success rounded-3 py-3 mb-4" role="alert">
                      <i className="bi bi-check-circle-fill me-2 fs-5"></i><br/>
                      Đã gửi liên kết khôi phục!<br/>Vui lòng kiểm tra hộp thư email <strong>{email}</strong>.
                    </div>
                    <Link to="/login" className="btn btn-outline-info rounded-pill fw-bold w-100 py-2">Quay lại Đăng nhập</Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold text-secondary small">Email của bạn</label>
                      <input type="email" className="form-control bg-light rounded-pill py-3 px-4 border-0" placeholder="name@example.com" required 
                             value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-info text-white w-100 rounded-pill py-3 fw-bold shadow-sm" disabled={status === 'loading'}>
                      {status === 'loading' ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-envelope-paper-fill me-2"></i>}
                      GỬI YÊU CẦU
                    </button>
                    <div className="text-center mt-3 small text-muted">
                      Đã chuyển sang chế độ giả lập: bấm là có phản hồi, không cần kết nối backend.
                    </div>
                    <div className="text-center mt-4">
                      <Link to="/login" className="text-muted text-decoration-none fw-bold hover-info"><i className="bi bi-arrow-left me-1"></i> Trở về</Link>
                    </div>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;