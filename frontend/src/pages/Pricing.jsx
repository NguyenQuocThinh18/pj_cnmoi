import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';

const Pricing = () => {
  // --- 1. PHẦN LOGIC XỬ LÝ SỰ KIỆN ---
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState("");
  
  // ĐÃ NÂNG CẤP: Bổ sung các trường dữ liệu thực tế sát đời thực
  const [formData, setFormData] = useState({ 
    name: "", phone: "", email: "", date: "", endDate: "", destination: "", rentalType: "driver" 
  });

  const handleOpenBooking = (carType) => {
    setSelectedCar(carType);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        endDate: formData.endDate,
        destination: formData.destination,
        rentalType: formData.rentalType,
        carType: selectedCar
      };

      await axios.post(`${API_BASE_URL}/api/rentals`, payload);
      
      alert(`🎉 Cảm ơn ${formData.name}!\nYêu cầu thuê [${selectedCar}] đi [${formData.destination}] đã được tiếp nhận.\nChúng tôi đã gửi email xác nhận lộ trình về thư điện tử và sẽ gọi điện cho bạn qua hotline ${formData.phone} ngay lập tức!`);
      
      setShowModal(false); 
      setFormData({ name: "", phone: "", email: "", date: "", endDate: "", destination: "", rentalType: "driver" }); 
    } catch (error) {
      alert("Có lỗi xảy ra trong quá trình truyền dữ liệu xe, vui lòng thử lại sau!");
    }
  };

  return (
    <div className="pricing-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .pricing-wrapper {
          background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
          padding: 80px 20px; min-height: 100vh;
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .header-box { text-align: center; margin-bottom: 60px; }
        .sub-badge {
          background: #e0f2fe; color: #0ea5e9; padding: 8px 20px;
          border-radius: 50px; font-weight: 700; font-size: 14px;
          display: inline-block; margin-bottom: 15px; text-transform: uppercase;
        }
        .main-title { font-size: 2.8rem; font-weight: 800; color: #1e293b; margin-bottom: 20px; }
        .pricing-container {
          max-width: 1200px; margin: 0 auto; display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; padding: 10px;
        }
        .price-card {
          background: white; border-radius: 30px; padding: 40px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f1f5f9; position: relative; display: flex;
          flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .price-card:hover { transform: translateY(-15px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); border-color: #38bdf8; }
        .price-card.popular {
          background: linear-gradient(165deg, #ffffff 0%, #f0f9ff 100%);
          border: 2px solid #0ea5e9; transform: scale(1.05); z-index: 2;
        }
        .price-card.popular:hover { transform: translateY(-15px) scale(1.05); }
        .hot-tag {
          position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(90deg, #f43f5e, #e11d48); color: white;
          padding: 6px 20px; border-radius: 50px; font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
        }
        .card-type { font-size: 1.5rem; font-weight: 700; color: #334155; margin-bottom: 20px; }
        .price-value { margin-bottom: 30px; }
        .price-value .amount { font-size: 3rem; font-weight: 800; color: #0ea5e9; }
        .price-value .unit { color: #64748b; font-size: 1rem; }
        .feature-list { list-style: none; padding: 0; margin: 0 0 40px 0; text-align: left; flex-grow: 1; }
        .feature-item { display: flex; align-items: center; margin-bottom: 15px; color: #475569; font-size: 1.05rem; }
        .check-icon {
          width: 22px; height: 22px; background: #f0fdf4; color: #22c55e;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          margin-right: 12px; font-size: 14px; flex-shrink: 0;
        }
        .cta-button {
          width: 100%; padding: 16px; border-radius: 16px; border: 2px solid #0ea5e9;
          background: transparent; color: #0ea5e9; font-size: 1.1rem; font-weight: 700;
          cursor: pointer; transition: all 0.3s;
        }
        .price-card.popular .cta-button { background: #0ea5e9; color: white; }
        .price-card:hover .cta-button { background: #0ea5e9; color: white; box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3); }
        .note-text { margin-top: 50px; color: #94a3b8; font-style: italic; text-align: center; }
        @media (max-width: 768px) { .price-card.popular { transform: scale(1); } .main-title { font-size: 2rem; } }

        /* --- CSS MODAL ĐẶT XE ĐÃ ĐƯỢC TỐI ƯU GIAO DIỆN RỘNG RÃI --- */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 9999;
        }
        .booking-modal {
          background: white; padding: 35px; border-radius: 24px;
          width: 90%; max-width: 520px; position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: modalFadeIn 0.3s ease-out forwards;
          max-height: 90vh; overflow-y: auto;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .close-btn {
          position: absolute; top: 20px; right: 20px; font-size: 28px;
          background: none; border: none; color: #94a3b8; cursor: pointer; transition: 0.2s;
        }
        .close-btn:hover { color: #f43f5e; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .form-group { margin-bottom: 15px; text-align: left; }
        .form-group.full-width { grid-column: span 2; }
        .form-group label { display: block; font-weight: 600; color: #334155; margin-bottom: 6px; font-size: 0.9rem; }
        .form-group input, .form-group select {
          width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 12px;
          font-size: 0.95rem; outline: none; transition: 0.3s; box-sizing: border-box;
        }
        .form-group input:focus, .form-group select:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15); }
        .submit-btn {
          width: 100%; padding: 14px; background: #0ea5e9; color: white; border: none;
          border-radius: 12px; font-weight: bold; font-size: 1.05rem; cursor: pointer; transition: 0.3s; margin-top: 10px;
        }
        .submit-btn:hover { background: #0284c7; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); }
        
        @media (max-width: 576px) { .form-grid-2 { grid-template-columns: 1fr; } .form-group.full-width { grid-column: span 1; } }
      `}} />

      <div className="container">
        <div className="header-box">
          <span className="sub-badge">Dịch vụ chuyên nghiệp</span>
          <h2 className="main-title">Bảng Giá Thuê Xe Du Lịch</h2>
          <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Dàn xe đời mới, tài xế kinh nghiệm, cam kết mang lại trải nghiệm an toàn nhất.
          </p>
        </div>

        <div className="pricing-container">
          {/* Xe 4-7 Chỗ */}
          <div className="price-card">
            <h3 className="card-type">Xe 4 - 7 Chỗ</h3>
            <div className="price-value">
              <span className="amount">800k</span>
              <span className="unit"> / ngày</span>
            </div>
            <ul className="feature-list">
              <li className="feature-item"><span className="check-icon">✓</span> Xe Vios, Xpander, Innova đời mới</li>
              <li className="feature-item"><span className="check-icon">✓</span> Tùy chọn tự lái hoặc kèm tài xế</li>
              <li className="feature-item"><span className="check-icon">✓</span> Miễn phí khăn lạnh, nước suối</li>
              <li className="feature-item"><span className="check-icon">✓</span> Hỗ trợ lộ trình đi tỉnh tối ưu</li>
            </ul>
            <button className="cta-button" onClick={() => handleOpenBooking("Xe 4 - 7 Chỗ")}>LIÊN HỆ ĐẶT XE</button>
          </div>

          {/* Xe 16 Chỗ */}
          <div className="price-card popular">
            <div className="hot-tag">🔥 Phổ biến nhất</div>
            <h3 className="card-type">Xe 16 Chỗ</h3>
            <div className="price-value">
              <span className="amount">1.5Tr</span>
              <span className="unit"> / ngày</span>
            </div>
            <ul className="feature-list">
              <li className="feature-item"><span className="check-icon">✓</span> <b>Ford Transit, Hyundai Solati</b></li>
              <li className="feature-item"><span className="check-icon">✓</span> Ghế ngả cao cấp, cực rộng</li>
              <li className="feature-item"><span className="check-icon">✓</span> Tặng nón du lịch cao cấp</li>
              <li className="feature-item"><span className="check-icon">✓</span> Phù hợp đoàn gia đình, công ty</li>
            </ul>
            <button className="cta-button" onClick={() => handleOpenBooking("Xe 16 Chỗ")}>ĐẶT XE NGAY</button>
          </div>

          {/* Xe 29-45 Chỗ */}
          <div className="price-card">
            <h3 className="card-type">Xe 29 - 45 Chỗ</h3>
            <div className="price-value">
              <span className="amount">2.8Tr</span>
              <span className="unit"> / ngày</span>
            </div>
            <ul className="feature-list">
              <li className="feature-item"><span className="check-icon">✓</span> Dàn xe Universe đời mới nhất</li>
              <li className="feature-item"><span className="check-icon">✓</span> Hệ thống Karaoke giải trí</li>
              <li className="feature-item"><span className="check-icon">✓</span> Hầm hành lý siêu rộng</li>
              <li className="feature-item"><span className="check-icon">✓</span> Chuyên Teambuilding đoàn lớn</li>
            </ul>
            <button className="cta-button" onClick={() => handleOpenBooking("Xe 29 - 45 Chỗ")}>LIÊN HỆ BÁO GIÁ</button>
          </div>
        </div>

        <p className="note-text">* Lưu ý: Giá có thể thay đổi tùy vào lộ trình và thời điểm lễ Tết.</p>
      </div>

      {/* --- ĐA NÂNG CẤP GIAO DIỆN FORM ĐẶT XE MỚI --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            <h2 style={{ color: '#0ea5e9', marginBottom: '5px', marginTop: 0 }}>Xác nhận phiếu thuê</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Loại xe lựa chọn: <b>{selectedCar}</b></p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Họ và tên người đặt *</label>
                  <input type="text" required placeholder="VD: Nguyễn Văn A" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Số điện thoại liên hệ *</label>
                  <input type="tel" required placeholder="VD: 0909000000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Địa chỉ Email (Nhận thông tin phiếu) *</label>
                <input type="email" required placeholder="VD: customer@gmail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="form-group full-width">
                <label>Lộ trình di chuyển / Điểm đến mong muốn *</label>
                <input type="text" required placeholder="VD: Đi Vũng Tàu 2 ngày 1 đêm, Đi nội thành..." value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Ngày đi (Khởi hành) *</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Ngày về (Kết thúc thuê) *</label>
                  <input type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Hình thức thuê xe đăng ký *</label>
                <select value={formData.rentalType} onChange={(e) => setFormData({...formData, rentalType: e.target.value})}>
                  <option value="driver">Cần tài xế phục vụ của công ty</option>
                  <option value="self">Thuê xe tự lái (Tự quản lý hành trình)</option>
                </select>
              </div>
              
              <button type="submit" className="submit-btn">ĐĂNG KÝ THUÊ XE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;