/*
 * Home.jsx
 * Trang chủ với banner, tour nổi bật và mục giới thiệu.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

function Home() {
  const [allTours, setAllTours] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Khởi tạo hiệu ứng cuộn AOS
    AOS.init({
      duration: 1000, 
      once: true, 
      offset: 50, 
    });

    const fetchTours = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tours`);
        if (res.data.success) {
          const tours = res.data.data || [];
          setAllTours(tours);
          setFeaturedTours(tours.filter(t => t.featured).slice(0, 6));
        }
      } catch (error) {
        console.error("Lỗi lấy tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const filterTours = (query) => {
    const search = query.trim().toLowerCase();
    if (!search) return [];

    return allTours.filter((tour) => {
      const fields = [
        tour.title,
        tour.city,
        tour.duration,
        tour.description,
        tour.category,
      ];
      return fields.some((field) => String(field || '').toLowerCase().includes(search));
    });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setSearchResults(filterTours(value));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchResults(filterTours(searchQuery));
  };

  return (
    <div className="homepage-wrapper">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Open+Sans:wght@400;600&display=swap');

          /* FIX LỖI 2 THANH CUỘN */
          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden !important;
            width: 100%;
            height: auto;
          }

          .homepage-wrapper { 
            font-family: 'Montserrat', sans-serif;
            overflow: visible; /* Để body xử lý thanh cuộn dọc */
            width: 100%;
          }

          /* 1. VIDEO HERO SECTION */
          .video-hero-section {
            position: relative;
            height: 90vh;
            min-height: 650px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: -85px; 
            overflow: hidden;
            background-color: #1a1a1a;
            background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
          }
          .hero-video {
            position: absolute;
            top: 50%; left: 50%;
            min-width: 100%; min-height: 100%;
            transform: translateX(-50%) translateY(-50%);
            z-index: 0;
            object-fit: cover;
          }
          .video-overlay {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%);
            z-index: 1;
          }
          .hero-content {
            position: relative; z-index: 2; color: white; width: 100%; max-width: 1200px; padding: 0 20px;
          }

          .hero-sub-title {
            letter-spacing: 4px; 
            font-size: 1rem;
            text-transform: uppercase;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            color: #0dcaf0;
          }
          .hero-sub-title::before {
            content: '';
            display: inline-block;
            width: 40px;
            height: 3px;
            background: #0dcaf0;
          }

          .hero-main-title {
            font-size: clamp(2.5rem, 8vw, 5rem);
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 30px;
            text-shadow: 2px 4px 15px rgba(0,0,0,0.5);
          }

          .search-box {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 12px;
            border-radius: 60px;
            display: flex;
            max-width: 800px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
          }
          .search-box:focus-within {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.02);
          }
          .search-box input { 
            color: white !important; 
            font-size: 1.1rem;
            font-family: 'Open Sans', sans-serif;
          }
          .search-box input::placeholder { color: rgba(255,255,255,0.8); }

          /* 2. KHỐI TÍNH NĂNG */
          .feature-card {
            background: white; border-radius: 20px; padding: 45px 25px; text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: all 0.4s ease;
            height: 100%;
          }
          .feature-card:hover { transform: translateY(-15px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .icon-wrapper {
            width: 85px; height: 85px; background: #f0f9ff; color: #0dcaf0;
            border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 38px; margin: 0 auto 25px;
          }

          /* 3. ĐIỂM ĐẾN & TOUR CARD */
          .destination-card { position: relative; border-radius: 24px; overflow: hidden; height: 400px; cursor: pointer; }
          .destination-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.5s ease; }
          .destination-card:hover img { transform: scale(1.1); }
          .destination-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 75%); display: flex; flex-direction: column; justify-content: flex-end; padding: 35px; color: white; }

          .tour-card { border-radius: 24px; overflow: hidden; border: none; transition: all 0.4s ease; background: white; height: 100%; display: flex; flex-direction: column; box-shadow: 0 12px 30px rgba(0,0,0,0.07); }
          .tour-card:hover { transform: translateY(-15px); box-shadow: 0 30px 60px rgba(0,0,0,0.15); }
          .tour-img-box { position: relative; height: 260px; overflow: hidden; }
          .tour-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s; }
          .tour-card:hover .tour-img-box img { transform: scale(1.08); }
          
          .hot-badge { position: absolute; top: 20px; right: 20px; background: linear-gradient(45deg, #ff4757, #ff6b81); color: white; font-size: 11px; font-weight: 800; padding: 7px 18px; border-radius: 30px; z-index: 2; box-shadow: 0 5px 15px rgba(255,71,87,0.4); text-transform: uppercase; }
          
          .parallax-section {
            position: relative;
            background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop');
            background-attachment: fixed; background-position: center; background-size: cover; padding: 140px 0; color: white; text-align: center;
          }

          .gradient-text { background: linear-gradient(45deg, #0dcaf0, #007bff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; }
        `}
      </style>

      {/* 1. HERO SECTION */}
      <section className="video-hero-section">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
          className="hero-video"
        >
          <source src="https://static.videezy.com/system/resources/previews/000/052/734/original/Aerial_view_of_the_island_and_ocean.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        
        <div className="hero-content mt-5" data-aos="fade-up">
          <div className="text-center text-md-start">
            <h6 className="hero-sub-title">Khám phá hành trình tốt nhất</h6>
            <h1 className="hero-main-title">
              Cùng tạo nên <br/>
              <span style={{ color: '#0dcaf0' }}>kỳ nghỉ tuyệt vời của bạn</span>
            </h1>
            <p className="fs-5 text-white opacity-90 mb-5 d-none d-md-block fw-light" style={{maxWidth: '650px', lineHeight: '1.8'}}>
              Du Lịch Việt đồng hành cùng bạn trên mọi hành trình khám phá những miền đất mới. Hãy để chúng tôi kể tiếp câu chuyện trải nghiệm của bạn.
            </p>
            <form className="search-box" onSubmit={handleSearchSubmit}>
              <div className="d-flex align-items-center flex-grow-1 px-4">
                <i className="bi bi-geo-alt text-info fs-4 me-3"></i>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent shadow-none"
                  placeholder="Bạn muốn đi du lịch ở đâu?..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <button type="submit" className="btn btn-info text-white rounded-pill px-5 py-3 fw-bold shadow-sm">
                TÌM KIẾM
              </button>
            </form>
          </div>
        </div>
      </section>

      {searchQuery.trim() !== '' && (
        <section className="py-5 bg-white">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4" data-aos="fade-up">
              <div>
                <h2 className="fw-bold mb-1 text-dark" style={{ fontSize: '2.4rem' }}>Kết quả tìm kiếm</h2>
                <p className="text-muted mb-0">Hiển thị tour liên quan đến "{searchQuery}"</p>
              </div>
              <div className="text-muted small">
                {searchResults.length > 0 ? `${searchResults.length} tour tìm được` : 'Không tìm thấy tour phù hợp'}
              </div>
            </div>

            <div className="row g-4">
              {searchResults.length > 0 ? (
                searchResults.map((tour) => (
                  <div className="col-12 col-md-6 col-lg-4" key={tour._id} data-aos="fade-up">
                    <div className="tour-card">
                      <div className="tour-img-box">
                        <img src={resolveImageUrl(tour.image)} alt={tour.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500&q=80'; }} />
                      </div>
                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2 small text-muted fw-bold">
                          <span><i className="bi bi-geo-alt text-info me-1"></i> {tour.city}</span>
                          <span><i className="bi bi-calendar3 text-info me-1"></i> {tour.duration}</span>
                        </div>
                        <h5 className="fw-bold mb-3 text-dark flex-grow-1" style={{ lineHeight: '1.6', fontSize: '1.25rem' }}>{tour.title}</h5>
                        <p className="text-muted small mb-3" style={{ minHeight: '48px' }}>{tour.description || 'Tour chuyên nghiệp, chất lượng cao.'}</p>
                        <div className="d-flex justify-content-between align-items-end mt-auto pt-3 border-top">
                          <div>
                            <small className="text-muted d-block" style={{ fontSize: '11px', fontWeight: '700' }}>Giá từ</small>
                            <span className="fw-bold text-danger fs-5">{tour.price?.toLocaleString()} đ</span>
                          </div>
                          <Link to={`/tours/id/${tour._id}`} className="btn btn-info text-white rounded-pill px-4 py-2 fw-bold shadow-sm">
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="alert alert-warning mb-0" role="alert">
                    Không tìm thấy tour phù hợp với từ khóa "{searchQuery}". Vui lòng thử lại với từ khóa khác.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2. KHỐI TÍNH NĂNG */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc', position: 'relative', zIndex: 10 }}>
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-md-3 col-6" data-aos="fade-up" data-aos-delay="0">
              <div className="feature-card">
                <div className="icon-wrapper"><i className="bi bi-award"></i></div>
                <h5 className="fw-bold">Giá Tốt Nhất</h5>
                <p className="text-muted small mb-0">Cam kết mức giá tour cạnh tranh và minh bạch nhất.</p>
              </div>
            </div>
            <div className="col-md-3 col-6" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-card">
                <div className="icon-wrapper"><i className="bi bi-shield-lock"></i></div>
                <h5 className="fw-bold">An Toàn Tuyệt Đối</h5>
                <p className="text-muted small mb-0">Bảo hiểm du lịch trọn gói cho mọi hành khách.</p>
              </div>
            </div>
            <div className="col-md-3 col-6" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-card">
                <div className="icon-wrapper"><i className="bi bi-chat-heart"></i></div>
                <h5 className="fw-bold">Hỗ Trợ Tận Tâm</h5>
                <p className="text-muted small mb-0">Đội ngũ chuyên viên tư vấn trực tuyến 24/7.</p>
              </div>
            </div>
            <div className="col-md-3 col-6" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-card">
                <div className="icon-wrapper"><i className="bi bi-map"></i></div>
                <h5 className="fw-bold">Lịch Trình Riêng</h5>
                <p className="text-muted small mb-0">Thiết kế tour độc đáo theo yêu cầu cá nhân.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ĐIỂM ĐẾN YÊU THÍCH */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-down">
            <h2 className="fw-bold mb-2 text-dark" style={{fontSize: '2.8rem'}}>ĐIỂM ĐẾN <span className="gradient-text">YÊU THÍCH</span></h2>
            <p className="text-muted">Khám phá những vùng đất đang dẫn đầu xu hướng du lịch 2026</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-6" data-aos="fade-right">
              <Link to="/tour-trong-nuoc" state={{category: 'Miền Tây'}} className="text-decoration-none">
                <div className="destination-card">
                  <img src="/assets/img/du-lich-mien-tay-mua-nao-dep-nhat.jpg" alt="Miền Tây" />
                  <div className="destination-overlay">
                    <span className="badge bg-info text-white mb-2 align-self-start shadow-sm px-3 py-2">Hào Sảng Sông Nước</span>
                    <h3 className="fw-bold mb-1">Miền Tây Thân Thương</h3>
                    <p className="mb-0 opacity-90 small">Về nơi phù sa bồi đắp tâm hồn</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="row g-4">
                <div className="col-sm-6" data-aos="fade-down">
                  <Link to="/tour-trong-nuoc" state={{category: 'Miền Bắc'}} className="text-decoration-none">
                    <div className="destination-card">
                      <img src="/assets/img/Mai-Chau-2-e2bc2.jpg" alt="Miền Bắc" />
                      <div className="destination-overlay">
                        <h4 className="fw-bold mb-1">Tây Bắc Mù Sương</h4>
                        <p className="mb-0 opacity-90 small">Hùng vĩ núi non</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6" data-aos="fade-up" data-aos-delay="100">
                  <Link to="/tour-trong-nuoc" state={{category: 'Đảo'}} className="text-decoration-none">
                    <div className="destination-card">
                      <img src="/assets/img/binh-dinh.jpg" alt="Biển Đảo" />
                      <div className="destination-overlay">
                        <h4 className="fw-bold mb-1">Thiên Đường Biển</h4>
                        <p className="mb-0 opacity-90 small">Cát trắng nắng vàng</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PARALLAX BANNER */}
      <section className="parallax-section my-5">
        <div className="container" data-aos="zoom-in">
          <h2 className="fw-bold" style={{fontSize: '3.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>Hè Rực Rỡ 2026</h2>
          <p className="fs-5 mt-3 mb-5 opacity-90 fw-light">Sẵn sàng trải nghiệm những chuyến đi đầy ắp niềm vui và ưu đãi cực lớn.</p>
          <Link to="/tour-trong-nuoc" className="btn btn-warning rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg border-0 text-dark">
            KHÁM PHÁ NGAY
          </Link>
        </div>
      </section>

      {/* 5. TOUR NỔI BẬT */}
      <section className="py-5 bg-white mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-4" data-aos="fade-right">
            <div>
              <h2 className="fw-bold mb-0 text-dark" style={{fontSize: '2.5rem'}}>TOUR <span className="gradient-text">NỔI BẬT</span></h2>
              <p className="text-muted mb-0 mt-1">Lựa chọn hàng đầu cho kỳ nghỉ hoàn hảo của bạn</p>
            </div>
            <Link to="/tour-trong-nuoc" className="btn btn-outline-info rounded-pill px-4 fw-bold d-none d-md-block">
              XEM TẤT CẢ <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-info"></div></div>
          ) : (
            <div className="row g-4">
              {featuredTours.map((tour, index) => (
                <div className="col-12 col-md-6 col-lg-4" key={tour._id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="tour-card">
                    <div className="tour-img-box">
                      <div className="hot-badge"><i className="bi bi-lightning-fill me-1"></i> BÁN CHẠY</div>
                      <img src={resolveImageUrl(tour.image)} alt={tour.title} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500&q=80'; }} />
                    </div>
                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-2 small text-muted fw-bold">
                        <span><i className="bi bi-geo-alt text-info me-1"></i> {tour.city}</span>
                        <span><i className="bi bi-calendar3 text-info me-1"></i> {tour.duration}</span>
                      </div>
                      <h5 className="fw-bold mb-3 text-dark flex-grow-1" style={{lineHeight: '1.6', fontSize: '1.25rem'}}>{tour.title}</h5>
                      <div className="d-flex justify-content-between align-items-end mt-auto pt-3 border-top">
                        <div>
                          <small className="text-muted d-block" style={{fontSize: '11px', fontWeight: '700'}}>Giá từ</small>
                          <span className="fw-bold text-danger fs-5">{tour.price?.toLocaleString()} đ</span>
                        </div>
                        <Link to={`/tours/id/${tour._id}`} className="btn btn-info text-white rounded-pill px-4 py-2 fw-bold shadow-sm">
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
      </section>
    </div>
  );
}

export default Home;