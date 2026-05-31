/*
 * BlogDetail.jsx
 * Trang chi tiết bài viết blog.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/apiConfig';
import { resolveImageUrl } from '../../public/assets/img/index/imagePath';

const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

function BlogDetail() {
  const { slug, id } = useParams();
  const resolveId = (slugParam, idParam) => {
    if (idParam && idParam.match(/^[0-9a-fA-F]{24}$/)) return idParam;
    if (!slugParam) return null;
    let cleaned = slugParam.replace(/\.html$/i, '');
    const chunks = cleaned.split('-');
    const maybeId = chunks[chunks.length - 1];
    return maybeId.match(/^[0-9a-fA-F]{24}$/) ? maybeId : null;
  };
  const blogId = resolveId(slug, id);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!blogId) {
        setError('Đường dẫn bài viết không hợp lệ.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const blogRes = await api.get(`/api/blogs/${blogId}`);
        const blogData = blogRes.data?.data || blogRes.data;
        
        if (blogData && blogData._id) {
          setBlog(blogData);
          // Gọi API bình luận riêng cho Blog
          const reviewRes = await api.get(`/api/reviews/blog/${blogId}`);
          setReviews(reviewRes.data?.data || []);
        } else {
          setError('Bài viết này không tồn tại.');
        }
      } catch (err) {
        setError('Lỗi kết nối tới server.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const userString = localStorage.getItem('user');
    if (!userString) return alert("Vui lòng đăng nhập để bình luận!");
    
    const user = JSON.parse(userString);
    setSubmitting(true);
    try {
      await api.post('/api/reviews', {
        blogId: blogId,
        userId: user.id || user._id,
        comment,
        rating: 5
      });
      setComment('');
      // Refresh danh sách bình luận
      const updated = await api.get(`/api/reviews/blog/${blogId}`);
      setReviews(updated.data.data);
      alert("Đăng bình luận thành công!");
    } catch (err) {
      console.error('Lỗi bình luận:', err);
      alert("Lỗi khi gửi bình luận. Bạn nhớ restart server backend nhé!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-info"></div></div>;
  if (error || !blog) return <div className="text-center py-5 mt-5"><h2>{error}</h2><Link to="/blog" className="btn btn-info text-white">Quay lại Blog</Link></div>;

  return (
    <div className="bg-white min-vh-100">
      <div 
        className="position-relative d-flex align-items-end shadow-sm" 
        style={{ 
          height: '550px', 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${resolveImageUrl(blog.image)})`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
        }}
      >
        <div className="container pb-5 text-white">
          <Link to="/blog" className="text-white text-decoration-none mb-4 d-inline-block p-2 rounded-pill bg-white bg-opacity-25 shadow-sm">
            <i className="bi bi-chevron-left ms-2 me-2"></i> Quay lại Blog
          </Link>
          <div className="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold">#{blog.category}</div>
          <h1 className="display-4 fw-bold mb-4" style={{ textShadow: '2px 4px 10px rgba(0,0,0,0.3)' }}>{blog.title}</h1>
          
          {/* PHẦN ĐÃ FIX: Chỉ giữ icon và text, KHÔNG CÒN BORDER XANH */}
          <div className="d-flex gap-4 fs-5 opacity-90 mt-2">
            <span className="d-flex align-items-center">
              <i className="bi bi-person-circle me-2 text-warning"></i>
              {blog.author?.name || 'Ban quản trị'}
            </span>
            <span className="d-flex align-items-center">
              <i className="bi bi-clock me-2 text-warning"></i>
              {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <article className="blog-content mb-5">
              <div className="text-dark lh-lg" style={{ fontSize: '1.25rem', whiteSpace: 'pre-line', textAlign: 'justify' }}>
                {blog.content}
              </div>
            </article>
            
            <hr className="my-5 opacity-25" />

            {/* PHẦN BÌNH LUẬN */}
            <div className="comment-section">
              <h3 className="fw-bold mb-4 text-primary"><i className="bi bi-chat-dots-fill me-3"></i>Thảo luận ({reviews.length})</h3>
              <div className="bg-light p-4 rounded-5 mb-5 shadow-sm border-0">
                <form onSubmit={handleCommentSubmit}>
                  <textarea 
                    className="form-control border-0 shadow-sm mb-3 p-3 rounded-4" 
                    rows="4" placeholder="Chia sẻ suy nghĩ của bạn..."
                    value={comment} onChange={(e) => setComment(e.target.value)} required
                  ></textarea>
                  <button type="submit" className="btn btn-info text-white rounded-pill px-5 fw-bold" disabled={submitting}>Gửi bình luận</button>
                </form>
              </div>

              <div className="reviews-list">
                {reviews.map((rev) => (
                  <div key={rev._id} className="d-flex mb-4 p-4 rounded-4 bg-white shadow-sm border border-light">
                    <div className="flex-shrink-0">
                      <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '50px', height: '50px' }}>
                        {rev.userId?.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ms-3 w-100">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-bold mb-0">{rev.userId?.name}</h6>
                        <small className="text-muted">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</small>
                      </div>
                      <p className="text-secondary mb-0 mt-1">{rev.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;