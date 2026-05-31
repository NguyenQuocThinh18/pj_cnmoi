/*
 * Navbar.jsx
 * Thanh điều hướng chính của giao diện.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const [featuredTours, setFeaturedTours] = useState([]);

  const toggleNav = () => setNavOpen((open) => !open);
  const closeNav = () => {
    setNavOpen(false);
    setOpenDropdown('');
  };
  const handleNavLinkClick = () => closeNav();
  const toggleMobileDropdown = (dropdownName, e) => {
    if (window.innerWidth >= 992) return;
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown((current) => (current === dropdownName ? '' : dropdownName));
  };

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) setUser(JSON.parse(userString));

    const fetchFeaturedTours = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tours`);
        if (res.data.success) {
          const fTours = res.data.data.filter(t => t.featured === true).slice(0, 4);
          setFeaturedTours(fTours);
        }
      } catch (error) { console.error("Lỗi lấy danh sách tour nổi bật:", error); }
    };
    fetchFeaturedTours();
  }, []);

  useEffect(() => { if (!user) setIsDropdownOpen(false); }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsDropdownOpen(false);
    alert('Đã đăng xuất!');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-dark shadow py-3">
      <style>
        {`
          .custom-dropdown-item:hover { background-color: #f8f9fa !important; color: #0dcaf0 !important; transition: all 0.2s ease-in-out; }
          .custom-dropdown-item:hover .bi-chevron-right { color: #0dcaf0 !important; transform: translateX(3px); transition: transform 0.2s; }
          .mega-menu-container { width: 850px; left: 50% !important; transform: translateX(-35%) !important; border-radius: 16px; padding: 25px; }
          .mega-menu-link { color: #495057; text-decoration: none; padding: 8px 0; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 600; transition: color 0.2s; }
          .mega-menu-link:hover { color: #0dcaf0; }
          .mega-menu-link:hover .bi-chevron-right { transform: translateX(3px); transition: transform 0.2s; }
          .mega-card { border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; min-width: 150px; }
          .mega-card:hover { transform: translateY(-4px); box-shadow: 0 6px 15px rgba(0,0,0,0.1); border-color: #0dcaf0; }
          .mega-card img { height: 110px; width: 100%; object-fit: cover; }
          .mega-card-title { font-size: 13px; font-weight: 700; text-align: center; padding: 10px 5px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        `}
      </style>

      <div className="container">
        <Link className="navbar-brand font_DPTBlacksword text-white fs-3" to="/">Du lịch Việt</Link>
        <button
          className="navbar-toggler bg-info border-0 shadow-none"
          type="button"
          onClick={toggleNav}
          aria-controls="navmenu"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className={`collapse navbar-collapse mobile-menu ${navOpen ? 'show' : ''}`} id="navmenu">
          <ul className="navbar-nav mx-auto text-uppercase fw-bold position-relative" onClick={handleNavLinkClick}>
            <li className="nav-item"><Link className="nav-link text-white px-3 hover-info" to="/">TRANG CHỦ</Link></li>
            
            {/* DROPDOWN GIỚI THIỆU */}
            <li className={`nav-item dropdown px-2 ${openDropdown === 'gioi-thieu' ? 'show' : ''}`} onMouseEnter={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.add('show')} onMouseLeave={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.remove('show')}>
              <Link className="nav-link text-white d-flex align-items-center hover-info" to="/gioi-thieu" onClick={(e) => toggleMobileDropdown('gioi-thieu', e)}>GIỚI THIỆU <i className="bi bi-chevron-down ms-1" style={{ fontSize: '12px' }}></i></Link>
              <ul className={`dropdown-menu border-0 shadow-lg mt-0 bg-white ${openDropdown === 'gioi-thieu' ? 'show' : ''}`} style={{ borderRadius: '12px', padding: '10px 0', textTransform: 'none', minWidth: '240px' }}>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/gioi-thieu"><span>Về chúng tôi</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'dat-tour' }}><span>Hướng dẫn đặt tour</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'thanh-toan' }}><span>Hướng dẫn thanh toán</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'bao-mat' }}><span>Chính sách bảo mật</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'dieu-khoan' }}><span>Điều khoản chung</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/chinh-sach" state={{ tab: 'faq' }}><span>Câu hỏi thường gặp</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
              </ul>
            </li>

            {/* MEGA MENU TOUR ĐÃ CẬP NHẬT */}
            <li className={`nav-item dropdown px-2 ${openDropdown === 'tour-du-lich' ? 'show' : ''}`} onMouseEnter={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.add('show')} onMouseLeave={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.remove('show')}>
              <Link className="nav-link text-white d-flex align-items-center hover-info" to="/tour-trong-nuoc" onClick={(e) => toggleMobileDropdown('tour-du-lich', e)}>TOUR DU LỊCH <i className="bi bi-chevron-down ms-1" style={{ fontSize: '12px' }}></i></Link>
              <div className={`dropdown-menu shadow-lg border-0 bg-white mega-menu-container mt-0 ${openDropdown === 'tour-du-lich' ? 'show' : ''}`} style={{ textTransform: 'none' }}>
                <div className="row g-4">
                  <div className="col-6">
                    <h6 className="text-info fw-bold mb-3" style={{ fontSize: '13px', letterSpacing: '1px' }}>TOUR TRONG NƯỚC</h6>
                    <div className="pe-2">
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ category: 'Miền Tây' }}>Tour Miền Tây <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ category: 'Miền Nam' }}>Tour Miền Nam <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ category: 'Miền Trung' }}>Tour Miền Trung <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ category: 'Miền Bắc' }}>Tour Miền Bắc <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ category: 'Tây Nguyên' }}>Tour Tây Nguyên <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-trong-nuoc" state={{ category: 'Đảo' }}>Tour Biển Đảo <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                    </div>
                  </div>
                  <div className="col-6 border-start">
                    <h6 className="text-info fw-bold mb-3 ps-2" style={{ fontSize: '13px', letterSpacing: '1px' }}>TOUR QUỐC TẾ</h6>
                    <div className="ps-2">
                      <Link className="mega-menu-link" to="/tour-quoc-te" state={{ category: 'Châu Á' }}>Tour Châu Á <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-quoc-te" state={{ category: 'Châu Âu' }}>Tour Châu Âu <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-quoc-te" state={{ category: 'Châu Phi' }}>Tour Châu Phi <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-quoc-te" state={{ category: 'Bắc Mỹ' }}>Tour Bắc Mỹ <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-quoc-te" state={{ category: 'Nam Mỹ' }}>Tour Nam Mỹ <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                      <Link className="mega-menu-link" to="/tour-quoc-te" state={{ category: 'Châu Đại Dương/Úc' }}>Tour Châu Đại Dương/Úc <i className="bi bi-chevron-right text-muted" style={{ fontSize: '11px' }}></i></Link>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-top">
                  <h6 className="text-info fw-bold mb-3" style={{ fontSize: '13px', letterSpacing: '1px' }}>NỔI BẬT</h6>
                  <div className="d-flex gap-3">
                    {featuredTours.length > 0 ? (
                      featuredTours.map((tour) => (
                        <div
                          key={tour._id}
                          className="mega-card flex-fill"
                          onClick={() => {
                            navigate('/tour-trong-nuoc', { state: { search: tour.title } });
                            closeNav();
                          }}
                        >
                          <img src={resolveImageUrl(tour.image)} alt={tour.title} />
                          <div className="mega-card-title" title={tour.title}>{tour.title}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted small w-100 text-center py-3"><i className="bi bi-inbox me-2"></i> Chưa có tour nổi bật nào được bật trong Admin.</div>
                    )}
                  </div>
                </div>
              </div>
            </li>

            <li className="nav-item"><Link className="nav-link text-white px-3 hover-info" to="/bang-gia">BẢNG GIÁ</Link></li>
            
            {/* DROPDOWN BLOG */}
            <li className={`nav-item dropdown px-2 ${openDropdown === 'blog' ? 'show' : ''}`} onMouseEnter={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.add('show')} onMouseLeave={(e) => e.currentTarget.querySelector('.dropdown-menu').classList.remove('show')}>
              <Link className="nav-link text-white d-flex align-items-center hover-info" to="/blog" onClick={(e) => toggleMobileDropdown('blog', e)}>BLOG <i className="bi bi-chevron-down ms-1" style={{ fontSize: '12px' }}></i></Link>
              <ul className={`dropdown-menu border-0 shadow-lg mt-0 bg-white ${openDropdown === 'blog' ? 'show' : ''}`} style={{ borderRadius: '12px', padding: '10px 0', textTransform: 'none', minWidth: '230px' }}>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/blog" state={{ category: 'Cẩm Nang Du Lịch' }}><span>Cẩm Nang Du Lịch</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/blog" state={{ category: 'Đặc Sản Miền Tây' }}><span>Đặc Sản Miền Tây</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/blog" state={{ category: 'Địa Điểm Du Lịch' }}><span>Địa Điểm Du Lịch</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
                <li><Link className="dropdown-item py-2 px-4 text-dark fw-bold d-flex justify-content-between align-items-center custom-dropdown-item" to="/blog" state={{ category: 'Văn Hóa Miền Tây' }}><span>Văn Hóa Miền Tây</span> <i className="bi bi-chevron-right text-muted" style={{ fontSize: '12px' }}></i></Link></li>
              </ul>
            </li>

            <li className="nav-item"><Link className="nav-link text-white px-3 hover-info" to="/lien-he">LIÊN HỆ</Link></li>
          </ul>
          
          <div className="d-flex align-items-center ms-lg-3">
            <Link className="btn btn-outline-info fw-bold rounded-pill px-3 me-3" to="/tra-cuu" style={{ borderWidth: '2px' }} onClick={closeNav}><i className="bi bi-search me-1"></i> Tra cứu</Link>
            {user ? (
              <div className="dropdown">
                <button className="btn btn-info text-white rounded-pill dropdown-toggle fw-bold" type="button" onClick={() => setIsDropdownOpen((v) => !v)} aria-expanded={isDropdownOpen}>Chào, {user.name.split(' ').pop()}</button>
                <ul className={`dropdown-menu dropdown-menu-end shadow ${isDropdownOpen ? 'show' : ''}`} style={{ borderRadius: '12px' }}>
                  {(user.role === 'admin' || user.role === 'staff') && (
                    <li><Link className="dropdown-item fw-bold text-primary py-2" to="/admin" onClick={() => setIsDropdownOpen(false)}><i className="bi bi-speedometer2 me-2"></i>{user.role === 'admin' ? 'Quản trị viên' : 'Trang nhân viên'}</Link></li>
                  )}
                  <li><Link className="dropdown-item fw-bold py-2" to="/tai-khoan" onClick={() => setIsDropdownOpen(false)}>Hồ sơ</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item fw-bold text-danger py-2" onClick={handleLogout}>Đăng xuất</button></li>
                </ul>
              </div>
            ) : (<Link className="btn btn-info text-white fw-bold rounded-pill px-4" to="/login" onClick={closeNav}>ĐĂNG NHẬP</Link>)}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;