/*
 * Blog.jsx
 * Trang danh sách blog.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../utils/imagePath';

const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

function Blog() {
  const categories = ['Tất cả', 'Cẩm Nang Du Lịch', 'Đặc Sản Miền Tây', 'Địa Điểm Du Lịch', 'Văn Hóa Miền Tây'];
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Gọi API lấy danh sách Blog
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/api/blogs');
        const payload = res.data;
        // Hỗ trợ cả 2 kiểu trả về: { success: true, data: [...] } hoặc [...]
        const data = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        console.log('📢 DỮ LIỆU BACKEND TRẢ VỀ:', payload);
        setBlogs(data);
      } catch (error) {
        console.error('Lỗi lấy blog từ server:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // 2. Xử lý chuyển đổi category từ trang khác tới (nếu có)
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  const slugify = (text) => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')

      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // 3. Logic lọc bài viết
  const filteredBlogs = activeCategory === 'Tất cả' 
    ? blogs 
    : blogs.filter(blog => (blog.category || '') === activeCategory);

  return (
    <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
      
      {/* ĐÃ FIX BANNER: Tách rõ các thuộc tính CSS để không bị lỗi nền xám */}
      <div className="position-relative d-flex align-items-center" style={{ 
        height: '350px', 
        backgroundImage: 'url("/assets/img/index/Vinh-ha-long.jpg")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
        <div className="container position-relative z-1 text-white text-start">
          <div style={{ maxWidth: '700px' }}>
            <h1 className="fw-bold display-4 mb-3 font_DPTBlacksword">Blog Du Lịch</h1>
            <p className="fs-5 opacity-90">Chia sẻ những chuyến hành trình, mẹo hay và tinh hoa ẩm thực vùng miền.</p>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        {/* THANH LỌC DANH MỤC (TABS) */}
        <div className="d-flex flex-wrap gap-2 mb-5">
          {categories.map((cat, index) => (
            <button 
              key={index}
              onClick={() => setActiveCategory(cat)}
              className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm transition-all ${
                activeCategory === cat ? 'btn-info text-white' : 'bg-white text-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* HIỂN THỊ TRẠNG THÁI LOADING */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status"></div>
            <p className="mt-2 text-secondary">Đang tải bài viết...</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <div className="col-12 col-md-6 col-lg-4" key={blog._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-scale transition-all">
                    
                    {/* Ảnh bài viết */}
                    <div className="position-relative">
                      <img 
                        src={resolveImageUrl(blog.image) || '/assets/img/index/du-lich-1.jpg'} 
                        className="card-img-top" 
                        style={{ height: '230px', objectFit: 'cover' }} 
                        alt={blog.title || 'Ảnh bài viết'} 
                        onError={(e) => { e.target.src = '/assets/img/index/du-lich-1.jpg'; }}
                      />
                      <span className="position-absolute top-0 end-0 bg-info text-white px-3 py-1 m-3 rounded-pill fw-bold small shadow-sm">
                        {blog.category || 'Chưa phân loại'}
                      </span>
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                      <h5 className="card-title fw-bold mb-3 text-dark lh-base" style={{ height: '54px', overflow: 'hidden' }}>
                        {blog.title || '⚠️ Tiêu đề đang bị trống do lỗi Backend'}
                      </h5>
                      
                      <p className="card-text text-muted small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {blog.excerpt || '⚠️ Không tìm thấy đoạn trích (excerpt). Hãy kiểm tra lại file Model ở Backend nhé!'}
                      </p>
                      
                      <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                        <Link to={`/blog/${slugify(blog.title)}-${blog._id}.html`} className="btn btn-link text-info text-decoration-none fw-bold p-0">
                          Đọc thêm <i className="bi bi-arrow-right-short fs-5"></i>
                        </Link>
                        <small className="text-muted"><i className="bi bi-calendar3 me-1"></i> {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                <i className="bi bi-journal-x text-muted" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3 text-secondary">Chưa có bài viết trong mục "{activeCategory}"</h5>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;