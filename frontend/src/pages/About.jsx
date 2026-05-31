/*
 * About.jsx
 * Trang giới thiệu về công ty.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="bg-white pt-5">
      {/* SECTION 1: CÂU CHUYỆN THƯƠNG HIỆU */}
      <div className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h6 className="text-info fw-bold mb-2 tracking-wide">VỀ DU LỊCH VIỆT</h6>
            <h1 className="display-5 fw-bold mb-4">Khởi nguồn từ tình yêu với dải đất hình chữ S</h1>
            <p className="text-secondary fs-5 mb-4" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
              Được xây dựng với tư duy tối ưu hóa trải nghiệm người dùng (UX/UI), <strong>Du lịch Việt</strong> không chỉ là một nền tảng đặt tour trực tuyến. Chúng tôi là cầu nối đưa du khách đến với những giá trị văn hóa chân thực nhất. Từ vẻ đẹp thanh bình, mộc mạc của miền Tây sông nước cho đến sự hùng vĩ của núi rừng Tây Bắc, mọi hành trình đều được thiết kế tỉ mỉ.
            </p>
            <div className="d-flex gap-3 mt-4">
              <Link to="/tour-trong-nuoc" className="btn btn-info text-white rounded-pill px-4 py-2 fw-bold shadow-sm">Khám phá ngay</Link>
              <Link to="/lien-he" className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold">Liên hệ đội ngũ</Link>
            </div>
          </div>
          <div className="col-lg-6 position-relative">
            {/* Ảnh ghép nghệ thuật */}
            <img src="/assets/img/images.jpg" alt="Miền Tây" className="img-fluid rounded-4 shadow-lg position-relative z-1" style={{ width: '80%', marginLeft: '20%' }} />
            <img src="/assets/img/download.jpg" alt="Việt Nam" className="img-fluid rounded-4 shadow-lg position-absolute border border-5 border-white" style={{ width: '50%', bottom: '-10%', left: '0', zIndex: 2 }} />
          </div>
        </div>
      </div>

      {/* SECTION 2: GIÁ TRỊ CỐT LÕI */}
      <div className="bg-light py-5 mt-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6">Tại sao chọn chúng tôi?</h2>
            <p className="text-secondary fs-5">Hệ thống thông minh - Trải nghiệm trọn vẹn</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                  <i className="bi bi-laptop text-info fs-1"></i>
                </div>
                <h4 className="fw-bold mb-3">Giao diện thông minh</h4>
                <p className="text-secondary">Trải nghiệm đặt tour mượt mà, thao tác đơn giản và tốc độ xử lý nhanh chóng nhờ nền tảng công nghệ hiện đại.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                  <i className="bi bi-shield-check text-danger fs-1"></i>
                </div>
                <h4 className="fw-bold mb-3">Bảo mật tuyệt đối</h4>
                <p className="text-secondary">Thông tin khách hàng và lịch sử đặt tour được lưu trữ an toàn với các tiêu chuẩn bảo mật khắt khe nhất.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                  <i className="bi bi-geo-alt text-success fs-1"></i>
                </div>
                <h4 className="fw-bold mb-3">Lịch trình đa dạng</h4>
                <p className="text-secondary">Từ những chuyến du ngoạn sinh thái đến các tour nghỉ dưỡng cao cấp, đáp ứng mọi nhu cầu của du khách.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;