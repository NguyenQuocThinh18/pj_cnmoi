/*
 * Blogs.jsx
 * Trang blog hoặc danh sách bài viết.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/blogs`);
        if (res.data.success) {
          setBlogs(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100">
      {/* Banner đầu trang */}
      <div className="container mb-5">
        <div className="p-5 rounded-5 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0dcaf0 100%)' }}>
          <h1 className="fw-bold display-4">Cẩm Nang Du Lịch</h1>
          <p className="lead opacity-75">Khám phá những điểm đến tuyệt vời và kinh nghiệm du lịch hữu ích từ chuyên gia.</p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {blogs.map((blog) => (
            <div className="col-12 col-md-6 col-lg-4" key={blog._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-shadow transition-all">
                <div className="position-relative">
                  <img 
                    src={blog.image} 
                    className="card-img-top" 
                    alt={blog.title} 
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                  <span className="position-absolute top-0 start-0 m-3 badge rounded-pill bg-info">
                    {blog.category}
                  </span>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-2 text-muted small">
                    <i className="bi bi-calendar3 me-2"></i>
                    {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                    <i className="bi bi-person-fill ms-3 me-2"></i>
                    {blog.author?.name || 'Admin'}
                  </div>
                  <h5 className="card-title fw-bold mb-3 lh-base" style={{ height: '3rem', overflow: 'hidden' }}>
                    {blog.title}
                  </h5>
                  <p className="card-text text-secondary text-truncate-3 small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrientation: 'vertical', overflow: 'hidden' }}>
                    {blog.content}
                  </p>
                  <Link to={`/blogs/${blog._id}`} className="btn btn-outline-primary rounded-pill px-4 fw-bold w-100">
                    Đọc tiếp <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-journal-x display-1 text-muted"></i>
              <p className="mt-3 text-muted">Hiện chưa có bài viết nào được đăng tải.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;