/*
 * Contact.jsx
 * Trang liên hệ với form gửi tin nhắn.
 * Chèn chú thích giải thích mục đích chính của file.
 */

function Contact() {
  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Banner Liên hệ */}
      <div className="bg-dark text-white text-center py-5 mb-5" style={{ background: 'url("https://images.unsplash.com/photo-1596423735880-5ec80c550cc4?auto=format&fit=crop&w=1500&q=80") center/cover', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}></div>
        <div className="container position-relative z-1 pt-4">
          <h1 className="display-4 fw-bold font_DPTBlacksword mt-4">Liên Hệ</h1>
          <p className="fs-5">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
        </div>
      </div>

      <div className="container">
        <div className="row g-5 bg-white p-4 p-md-5 rounded-4 shadow-sm">
          {/* Cột thông tin liên hệ */}
          <div className="col-lg-5">
            <h3 className="fw-bold text-info mb-4">Thông tin liên hệ</h3>
            <p className="text-secondary mb-4">Để lại lời nhắn hoặc liên hệ trực tiếp với đội ngũ Du Lịch Việt qua các thông tin dưới đây. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
            
            <div className="d-flex align-items-center mb-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info fs-4 me-3">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Trụ sở chính</h6>
                <p className="text-muted mb-0">Đại học Công nghiệp TP.HCM (IUH), Gò Vấp, TP.HCM</p>
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info fs-4 me-3">
                <i className="bi bi-shop"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Chi nhánh miền Tây</h6>
                <p className="text-muted mb-0">Bến Tre, Việt Nam</p>
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info fs-4 me-3">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Hotline hỗ trợ (24/7)</h6>
                <p className="text-muted mb-0">(+84) 778 118 008</p>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info fs-4 me-3">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Email liên hệ</h6>
                <p className="text-muted mb-0">thaitran2706@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Cột Form gửi tin nhắn */}
          <div className="col-lg-7 border-start pl-lg-5">
            <h3 className="fw-bold mb-4">Gửi lời nhắn cho chúng tôi</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Cảm ơn bạn! Lời nhắn đã được gửi."); }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Họ và tên</label>
                  <input type="text" className="form-control bg-light border-0 py-2 rounded-3" placeholder="Nhập tên của bạn" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small">Số điện thoại</label>
                  <input type="tel" className="form-control bg-light border-0 py-2 rounded-3" placeholder="Nhập số điện thoại" required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Tiêu đề</label>
                  <input type="text" className="form-control bg-light border-0 py-2 rounded-3" placeholder="Bạn cần hỗ trợ về vấn đề gì?" required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Nội dung</label>
                  <textarea className="form-control bg-light border-0 py-2 rounded-3" rows="4" placeholder="Nhập chi tiết lời nhắn..." required></textarea>
                </div>
                <div className="col-12 mt-4">
                  <button type="submit" className="btn btn-info text-white fw-bold px-5 py-2 rounded-pill shadow-sm">GỬI LỜI NHẮN <i className="bi bi-send ms-2"></i></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;