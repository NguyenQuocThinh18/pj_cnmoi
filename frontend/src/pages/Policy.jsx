/*
 * Policy.jsx
 * Trang chính sách của website.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Policy() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dat-tour');

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const tabs = [
    { id: 'dat-tour', title: 'Hướng dẫn đặt tour', icon: 'bi-hand-index-thumb' },
    { id: 'thanh-toan', title: 'Hướng dẫn thanh toán', icon: 'bi-credit-card' },
    { id: 'bao-mat', title: 'Chính sách bảo mật', icon: 'bi-shield-lock' },
    { id: 'dieu-khoan', title: 'Điều khoản chung', icon: 'bi-file-earmark-text' },
    { id: 'faq', title: 'Câu hỏi thường gặp', icon: 'bi-question-circle' }
  ];

  const faqItems = [
    {
      id: 'faq1',
      question: 'Trẻ em có được giảm giá không?',
      answer: 'Có. Trẻ em dưới 2 tuổi miễn phí. Trẻ từ 2 - 5 tuổi tính 50% vé. Trẻ từ 6 - 11 tuổi tính 75% vé. Từ 12 tuổi trở lên tính vé người lớn.',
    },
    {
      id: 'faq2',
      question: 'Tôi có thể thay đổi ngày khởi hành không?',
      answer: 'Bạn có thể thay đổi ngày khởi hành miễn phí nếu báo trước ít nhất 7 ngày so với ngày khởi hành ban đầu (tùy thuộc vào tình trạng chỗ trống của tour mới).',
    },
    {
      id: 'faq3',
      question: 'Có được phép hủy đơn tour không?',
      answer: 'Có, chúng tôi chấp nhận hủy đơn tour theo chính sách: Hủy trước 7 ngày hoàn tiền 100%, hủy 3-6 ngày hoàn tiền 50%, hủy trong 48h không hoàn tiền.',
    },
    {
      id: 'faq4',
      question: 'Tour có bảo hiểm du lịch không?',
      answer: 'Vâng, tất cả các tour của Du Lịch Việt đều đi kèm bảo hiểm du lịch trọn gói để bảo vệ quyền lợi của khách hàng.',
    },
    {
      id: 'faq5',
      question: 'Tôi cần chuẩn bị giấy tờ gì?',
      answer: 'Vui lòng mang theo CMND/CCCD/Passport và các giấy tờ cần thiết khác. Nếu có thẻ cộng hòa xã hội, bảo hiểm y tế cũng nên mang theo.',
    },
    {
      id: 'faq6',
      question: 'Thời gian tối đa để đăng ký tour là bao lâu?',
      answer: 'Bạn có thể đăng ký tour từ 1 ngày trước khi khởi hành (tùy thuộc vào tình trạng chỗ trống). Chúng tôi khuyến khích đăng ký sớm để được chọn phòng và lịch trình tốt hơn.',
    },
  ];

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
      <style>{`
        .animation-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .accordion-button:not(.collapsed) {
          background-color: #0dcaf0 !important;
          color: white !important;
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.125);
        }
        .accordion-button:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 202, 240, 0.25);
          border-color: #0dcaf0;
        }
        .accordion-item {
          border: 1px solid #dee2e6 !important;
        }
        .list-group-item.active {
          background-color: #0dcaf0 !important;
          border-color: #0dcaf0 !important;
        }
        .accordion-button {
          padding: 15px 20px;
          font-size: 0.95rem;
        }
        .accordion-body {
          padding: 20px;
        }
      `}</style>
      
      {/* Banner nhỏ */}
      <div className="bg-info text-white text-center py-5 mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #0dcaf0 0%, #087990 100%)' }}>
        <h1 className="fw-bold display-5 mt-3">Hỗ Trợ Khách Hàng</h1>
        <p className="fs-5 opacity-75">Tất cả thông tin và chính sách bạn cần biết</p>
      </div>

      <div className="container">
        <div className="row g-4">
          
          {/* CỘT TRÁI: MENU TABS */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 sticky-top" style={{ top: '75px' }}>
              <div className="list-group list-group-flush gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`list-group-item list-group-item-action border-0 rounded-3 px-3 py-3 fw-bold transition-all ${
                      activeTab === tab.id ? 'bg-info text-white shadow-sm' : 'text-secondary hover-bg-light'
                    }`}
                  >
                    <i className={`bi ${tab.icon} me-2 ${activeTab === tab.id ? 'text-white' : 'text-info'}`}></i> 
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: NỘI DUNG CHI TIẾT */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white min-vh-50">
              
              {activeTab === 'dat-tour' && (
                <div className="animation-fade-in">
                  <h3 className="fw-bold text-info mb-4 border-bottom pb-3">Hướng dẫn đặt tour</h3>
                  <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                    <strong>Bước 1:</strong> Tìm kiếm tour theo điểm đến hoặc sử dụng thanh Menu phía trên.<br/><br/>
                    <strong>Bước 2:</strong> Xem chi tiết lịch trình, giá cả và chọn số lượng hành khách.<br/><br/>
                    <strong>Bước 3:</strong> Nhấn nút "ĐẶT TOUR NGAY", kiểm tra lại thông tin cá nhân (Hệ thống sẽ tự động điền nếu bạn đã đăng nhập).<br/><br/>
                    <strong>Bước 4:</strong> Xác nhận và chuyển sang trang Thanh toán.<br/><br/>
                    <em>Lưu ý: Quý khách nên đặt tour trước ít nhất 7 ngày để đảm bảo dịch vụ tốt nhất.</em>
                  </p>
                </div>
              )}

              {activeTab === 'thanh-toan' && (
                <div className="animation-fade-in">
                  <h3 className="fw-bold text-info mb-4 border-bottom pb-3">Hướng dẫn thanh toán</h3>
                  <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                    Hệ thống Du Lịch Việt hỗ trợ đa dạng phương thức thanh toán để tạo sự thuận tiện tối đa cho quý khách:<br/><br/>
                    <strong>1. Thanh toán qua mã QR (Khuyên dùng):</strong> Sau khi đặt tour, hệ thống sinh ra mã QR. Quý khách mở App Ngân hàng hoặc MoMo để quét và thanh toán tức thì.<br/><br/>
                    <strong>2. Chuyển khoản ngân hàng:</strong><br/>
                    - Ngân hàng: Vietcombank (Chi nhánh TP.HCM)<br/>
                    - Số tài khoản: 0123456789<br/>
                    - Chủ tài khoản: TRAN MINH THAI<br/>
                    - Nội dung: Thanh toan don hang [Mã Booking]<br/><br/>
                    <strong>3. Thanh toán tiền mặt:</strong> Quý khách có thể đến trực tiếp văn phòng tại Đại học Công Nghiệp TP.HCM để thanh toán.
                  </p>
                </div>
              )}

              {activeTab === 'bao-mat' && (
                <div className="animation-fade-in">
                  <h3 className="fw-bold text-info mb-4 border-bottom pb-3">Chính sách bảo mật</h3>
                  <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                    Du lịch Việt cam kết bảo vệ thông tin cá nhân của khách hàng một cách tuyệt đối:<br/><br/>
                    - <strong>Thu thập thông tin:</strong> Chúng tôi chỉ thu thập Tên, Email, Số điện thoại để phục vụ cho quá trình đặt tour và hỗ trợ khách hàng.<br/>
                    - <strong>Sử dụng thông tin:</strong> Thông tin của bạn được mã hóa an toàn trong cơ sở dữ liệu và tuyệt đối không chia sẻ cho bên thứ ba vì mục đích thương mại.<br/>
                    - <strong>Bảo mật mật khẩu:</strong> Mật khẩu của quý khách được mã hóa một chiều (bcrypt) nên ngay cả Quản trị viên cũng không thể biết mật khẩu gốc của bạn.
                  </p>
                </div>
              )}

              {activeTab === 'dieu-khoan' && (
                <div className="animation-fade-in">
                  <h3 className="fw-bold text-info mb-4 border-bottom pb-3">Điều khoản chung</h3>
                  <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                    <strong>1. Chính sách hủy / đổi tour:</strong><br/>
                    - Hủy trước 7 ngày: Hoàn tiền 100%.<br/>
                    - Hủy từ 3-6 ngày: Hoàn tiền 50%.<br/>
                    - Hủy trong vòng 48h: Không hoàn tiền.<br/><br/>
                    <strong>2. Trách nhiệm của khách hàng:</strong><br/>
                    Quý khách vui lòng có mặt tại điểm đón đúng giờ. Mang theo đầy đủ giấy tờ tùy thân (CMND/CCCD/Passport) để làm thủ tục khách sạn và lên máy bay (nếu có).
                  </p>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="animation-fade-in">
                  <h3 className="fw-bold text-info mb-4 border-bottom pb-3">Câu hỏi thường gặp (FAQ)</h3>
                  <div className="accordion" id="faqAccordion">
                    
                    <div className="accordion-item border-0 mb-3 bg-light rounded-3">
                      <h2 className="accordion-header">
                        <button className="accordion-button rounded-3 fw-bold text-dark bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                          Trẻ em có được giảm giá không?
                        </button>
                      </h2>
                      <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-secondary">
                          Có. Trẻ em dưới 2 tuổi miễn phí. Trẻ từ 2 - 5 tuổi tính 50% vé. Trẻ từ 6 - 11 tuổi tính 75% vé. Từ 12 tuổi trở lên tính vé người lớn.
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item border-0 mb-3 bg-light rounded-3">
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed rounded-3 fw-bold text-dark bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                          Tôi có thể thay đổi ngày khởi hành không?
                        </button>
                      </h2>
                      <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-secondary">
                          Bạn có thể thay đổi ngày khởi hành miễn phí nếu báo trước ít nhất 7 ngày so với ngày khởi hành ban đầu (tùy thuộc vào tình trạng chỗ trống của tour mới).
                        </div>
                      </div>
                    </div>

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

export default Policy;