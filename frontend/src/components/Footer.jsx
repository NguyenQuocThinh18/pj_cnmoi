/*
 * Footer.jsx
 * Footer hiển thị thông tin liên hệ và liên kết.
 * Chèn chú thích giải thích mục đích chính của file.
 */

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Cột 1: Thông tin liên hệ (Giống Tour Bốn Phương) */}
          <div className="col-12 col-md-4">
            <h4 className="font_DPTBlacksword text-info mb-4">Du lịch Việt</h4>
            <p className="small text-secondary">Chúng tôi cam kết mang đến những chuyến đi ý nghĩa và kỷ niệm khó quên cho mọi gia đình Việt.</p>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2"><i className="bi bi-geo-alt-fill text-info me-2"></i> 12 Nguyễn Văn Bảo, Gò Vấp, TP.HCM (IUH)</li>
              <li className="mb-2"><i className="bi bi-telephone-fill text-info me-2"></i> (+84) 778 118 008</li>
              <li className="mb-2"><i className="bi bi-envelope-fill text-info me-2"></i> dulichviet@gmail.com</li>
            </ul>
          </div>

          {/* Cột 2: Danh mục */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-4">DANH MỤC</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/" className="text-secondary text-decoration-none">Trang chủ</a></li>
              <li className="mb-2"><a href="/gioi-thieu" className="text-secondary text-decoration-none">Giới thiệu</a></li>
              <li className="mb-2"><a href="/tour-trong-nuoc" className="text-secondary text-decoration-none">Tour trong nước</a></li>
              <li className="mb-2"><a href="/tour-quoc-te" className="text-secondary text-decoration-none">Tour quốc tế</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-4">HỖ TRỢ</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Điều khoản sử dụng</a></li>
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Chính sách bảo mật</a></li>
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Hướng dẫn đặt tour</a></li>
            </ul>
          </div>

          {/* Cột 4: Kết nối */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-4">KẾT NỐI VỚI CHÚNG TÔI</h5>
            <div className="d-flex gap-3 mb-4">
              <button className="btn btn-outline-info rounded-circle"><i className="bi bi-facebook"></i></button>
              <button className="btn btn-outline-info rounded-circle"><i className="bi bi-youtube"></i></button>
              <button className="btn btn-outline-info rounded-circle"><i className="bi bi-instagram"></i></button>
            </div>
            <p className="small text-secondary">Đăng ký để nhận tin khuyến mãi mới nhất!</p>
          </div>
        </div>
        
        <hr className="my-4 border-secondary" />
        <p className="text-center small text-secondary mb-0">© 2026 Du lịch Việt.</p>
      </div>
    </footer>
  );
}

export default Footer;