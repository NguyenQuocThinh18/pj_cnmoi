/*
 * TourList.jsx
 * Trang danh sách tour với bộ lọc và tìm kiếm.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../utils/imagePath';

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm chính xác hơn
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

const slugify = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

function TourList() {
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ BỘ LỌC ---
  const initialCategory = location.state?.category || 'all';
  const initialSearch = location.state?.search || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(1000000000); 
  const [sortOrder, setSortOrder] = useState('newest');

  // State quản lý danh mục động lấy trực tiếp từ dữ liệu Tour thực tế để tránh sót Tour Quốc tế
  const [dynamicCategories, setDynamicCategories] = useState([]);

  // --- FETCH API ---
  useEffect(() => {
    const fetchToursAndCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/tours`);
        if (res.data.success) {
          const toursData = res.data.data || [];
          setAllTours(toursData);
          
          // Tự động gom các nhóm danh mục xuất hiện trong DB (cả trong nước lẫn quốc tế)
          const uniqueCats = [...new Set(toursData.map(t => t.category).filter(Boolean))];
          setDynamicCategories(uniqueCats);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách tour và danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // ĐỂ FIX LỖI TRẮNG MÀN HÌNH: Đã gọi đúng tên hàm fetchToursAndCategories
    fetchToursAndCategories();
    window.scrollTo(0, 0);
  }, []);

  // Cập nhật bộ lọc khi người dùng chuyển mục từ Navbar thả xuống
  useEffect(() => {
    if (location.state?.category) setCategory(location.state.category);
    if (location.state?.search) setSearchTerm(location.state.search);
  }, [location.state]);

  // --- LOGIC LỌC DỮ LIỆU REAL-TIME ---
  const filteredTours = useMemo(() => {
    let result = [...allTours];

    // 1. Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const searchKey = removeAccents(searchTerm);
      result = result.filter(tour => 
        removeAccents(tour.title).includes(searchKey) || 
        removeAccents(tour.city).includes(searchKey)
      );
    }

    // 2. Lọc theo danh mục động (Khớp chuẩn hoặc chứa chuỗi danh mục)
    if (category !== 'all') {
      result = result.filter(tour => 
        removeAccents(tour.category) === removeAccents(category) ||
        removeAccents(tour.category).includes(removeAccents(category))
      );
    }

    // 3. Lọc theo mức giá tối đa từ thanh trượt
    result = result.filter(tour => (tour.price || 0) <= maxPrice);

    // 4. Sắp xếp kết quả
    if (sortOrder === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [allTours, searchTerm, category, maxPrice, sortOrder]);

  const clearFilter = () => {
    setSearchTerm('');
    setCategory('all');
    setMaxPrice(1000000000);
    setSortOrder('newest');
    navigate(location.pathname, { replace: true, state: null });
  };

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" }}>
      <style>
        {`
          .search-hero { background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop') center/cover; padding: 120px 0 80px; color: white; margin-top: -85px; }
          .filter-sidebar { position: sticky; top: 100px; transition: all 0.3s; }
          .tour-card { border-radius: 20px; overflow: hidden; border: none; transition: all 0.3s; background: white; height: 100%; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
          .tour-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
          .tour-img-box { position: relative; height: 240px; overflow: hidden; }
          .tour-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
          .tour-card:hover .tour-img-box img { transform: scale(1.08); }
          .hot-badge { position: absolute; top: 15px; left: 15px; background: linear-gradient(45deg, #ff4757, #ff6b81); color: white; font-size: 11px; font-weight: 800; padding: 5px 15px; border-radius: 30px; z-index: 2; box-shadow: 0 4px 10px rgba(255,71,87,0.3); text-transform: uppercase; }
          
          .filter-title { font-size: 1.1rem; letter-spacing: 0.5px; color: #1e293b; position: relative; padding-bottom: 12px; }
          .filter-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 40px; height: 3px; background: #0dcaf0; border-radius: 10px; }
          .section-label { font-size: 0.78rem; font-weight: 700; color: #94a3b8; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; }
          
          .custom-radio { display: none; }
          .custom-radio-label { display: flex; align-items: center; cursor: pointer; padding: 10px 14px; border-radius: 12px; transition: all 0.25s ease; color: #475569; font-size: 0.92rem; font-weight: 500; }
          .custom-radio-label:hover { background: #f1f5f9; color: #0f172a; }
          .custom-radio-label::before { content: ''; width: 16px; height: 16px; border: 2px solid #cbd5e1; border-radius: 50%; margin-right: 12px; transition: all 0.2s ease; flex-shrink: 0; }
          .custom-radio:checked + .custom-radio-label { color: #0ea5e9; font-weight: 600; background: #f0f9ff; }
          .custom-radio:checked + .custom-radio-label::before { border-color: #0ea5e9; background: #0ea5e9; box-shadow: inset 0 0 0 3px white; }

          .form-range { height: 6px; padding: 0; background-color: #e2e8f0; border-radius: 10px; }
          .form-range::-webkit-slider-thumb { width: 18px; height: 18px; margin-top: -6px; background: #0ea5e9; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(14,165,233,0.4); transition: 0.2s; cursor: grab; }
          .form-range::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.15); }
          .price-display-badge { background: linear-gradient(135deg, #0ea5e9, #0dcaf0); font-weight: 700; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(14,165,233,0.2); }
        `}
      </style>

      {/* HERO SECTION */}
      <section className="search-hero text-center mb-5">
        <div className="container mt-4">
          <h1 className="fw-black" style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '1px' }}>TÌM KIẾM HÀNH TRÌNH</h1>
          <p className="fs-5 opacity-90 mt-2">Khám phá hơn {allTours.length} tour du lịch đang chờ bạn trải nghiệm</p>
        </div>
      </section>

      <div className="container">
        <div className="row g-4">
          
          {/* ================= CỘT TRÁI: BỘ LỌC (SIDEBAR) ================= */}
          <div className="col-12 col-lg-3">
            <div className="filter-sidebar bg-white p-4 rounded-4 shadow-sm border border-0">
              <h5 className="fw-bold mb-4 filter-title"><i className="bi bi-sliders text-info me-2"></i> BỘ LỌC TÌM KIẾM</h5>
              
              {/* Lọc theo từ khóa */}
              <div className="mb-4 pt-2">
                <label className="section-label text-uppercase mb-2"><i className="bi bi-search"></i> Từ khóa / Keyword</label>
                <div className="input-group shadow-sm rounded-3 overflow-hidden border border-light">
                  <span className="input-group-text bg-white border-0 pe-1"><i className="bi bi-geo-alt text-muted"></i></span>
                  <input type="text" className="form-control border-0 shadow-none ps-2" style={{fontSize: '0.92rem'}} placeholder="Tìm thành phố, địa danh..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>

              {/* Lọc theo danh mục động */}
              <div className="mb-4">
                <label className="section-label text-uppercase mb-2"><i className="bi bi-grid-1x2"></i> Danh mục / Categories</label>
                <div className="d-flex flex-column gap-1 mt-2" style={{maxHeight: '320px', overflowY: 'auto', paddingRight: '5px'}}>
                  <div>
                    <input className="custom-radio" type="radio" name="category" id="cat-all" value="all" checked={category === 'all'} onChange={(e) => setCategory(e.target.value)} />
                    <label className="custom-radio-label" htmlFor="cat-all">Tất cả vùng miền</label>
                  </div>
                  
                  {dynamicCategories.map(cat => (
                    <div key={cat}>
                      <input className="custom-radio" type="radio" name="category" id={`cat-${cat}`} value={cat} checked={category === cat} onChange={(e) => setCategory(e.target.value)} />
                      <label className="custom-radio-label" htmlFor={`cat-${cat}`}>
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* BỘ LỌC MỨC GIÁ CHỈNH SỬA TOÀN DIỆN */}
              <div className="mb-4 pb-2">
                <label htmlFor="priceRange" className="section-label text-uppercase mb-3">
                  <i className="bi bi-currency-dollar"></i> Ngân sách tối đa / Budget
                </label>
                
                <input
                  type="range"
                  className="form-range"
                  min="100000"          
                  max="1000000000"      
                  step="500000"         
                  id="priceRange"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="text-muted small fw-bold">100.000 đ</span>
                  <span className="badge price-display-badge text-white px-3 py-2 rounded-pill">
                    {maxPrice >= 1000000000 ? 'Không giới hạn' : `Dưới ${maxPrice.toLocaleString('vi-VN')} đ`}
                  </span>
                </div>
              </div>

              {/* Nút Xóa Bộ Lọc */}
              <button className="btn btn-light text-secondary border w-100 rounded-pill fw-bold btn-sm py-2 mt-2 shadow-sm" style={{fontSize: '0.85rem', letterSpacing: '0.5px'}} onClick={clearFilter}>
                <i className="bi bi-arrow-counterclockwise me-1"></i> ĐẶT LẠI BỘ LỌC
              </button>
            </div>
          </div>

          {/* ================= CỘT PHẢI: KẾT QUẢ TÌM KIẾM ================= */}
          <div className="col-12 col-lg-9">
            
            {/* Thanh Sắp xếp */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center bg-white p-3 rounded-4 shadow-sm border-0 mb-4 gap-3">
              <div>
                <span className="text-secondary fw-semibold">Kết quả tìm kiếm: <span className="text-info fs-5 fw-bold mx-1">{filteredTours.length}</span> hành trình phù hợp</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-bold text-muted text-nowrap d-none d-md-block">Sắp xếp theo:</span>
                <select className="form-select form-select-sm border-light shadow-none rounded-pill px-3 py-2 fw-bold text-info bg-light" style={{width: '200px', cursor:'pointer'}} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="newest">Tour mới cập nhật</option>
                  <option value="priceAsc">Giá từ: Thấp đến Cao</option>
                  <option value="priceDesc">Giá từ: Cao xuống Thấp</option>
                </select>
              </div>
            </div>

            {/* Danh sách Tour */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-info" style={{width: '3rem', height: '3rem'}}></div>
                <p className="mt-3 text-muted fw-bold">Đang phân tích dữ liệu...</p>
              </div>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0 mt-4">
                <i className="bi bi-search text-muted opacity-25" style={{fontSize: '5rem'}}></i>
                <h3 className="fw-bold text-secondary mt-3">Không tìm thấy kết quả</h3>
                <p className="text-muted">Vui lòng điều chỉnh lại thanh kéo ngân sách hoặc từ khóa tìm kiếm để tìm thêm tour.</p>
                <button className="btn btn-info text-white rounded-pill px-5 mt-2 fw-bold shadow-sm" onClick={clearFilter}>
                  Xem tất cả hành trình
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredTours.map((tour) => (
                  <div className="col-12 col-md-6 col-xl-4" key={tour._id}>
                    <div className="tour-card">
                      <div className="tour-img-box">
                        {tour.featured && <div className="hot-badge"><i className="bi bi-lightning-fill me-1"></i> BÁN CHẠY</div>}
                        <span className="position-absolute top-0 end-0 bg-dark text-white px-3 py-1 m-3 rounded-pill fw-bold small opacity-75 shadow-sm" style={{fontSize: '11px', zIndex: 2}}>
                          {tour.duration}
                        </span>
                        <img src={resolveImageUrl(tour.image)} alt={tour.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500&q=80'; }} />
                      </div>
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2 small fw-bold">
                          <span className="text-muted"><i className="bi bi-geo-alt-fill text-danger me-1"></i> {tour.city}</span>
                          <span className="badge bg-light text-info border border-info">{tour.category || 'Tour Việt'}</span>
                        </div>
                        <h5 className="fw-bold mb-3 text-dark flex-grow-1" style={{lineHeight: '1.5', fontSize: '1.15rem'}}>{tour.title}</h5>
                        <div className="d-flex justify-content-between align-items-end mt-auto pt-3 border-top">
                          <div>
                            <small className="text-muted d-block" style={{fontSize: '11px', fontWeight: '700'}}>Giá trọn gói</small>
                            <span className="fw-bold text-danger fs-5">{tour.price?.toLocaleString('vi-VN')} đ</span>
                          </div>
                          <Link to={`/tours/${slugify(tour.title)}-${tour._id}.html`} className="btn btn-info text-white rounded-pill px-4 py-2 fw-bold shadow-sm" style={{fontSize: '14px'}}>
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TourList;