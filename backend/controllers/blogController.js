/*
 * blogController.js
 * Xử lý CRUD bài viết blog và lấy dữ liệu blog.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const Blog = require('../models/Blog');

// Lấy tất cả bài viết (Đã thêm populate để lấy tên tác giả hiển thị lên UI)
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Blog.countDocuments();
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}?${new URLSearchParams(req.query).toString()}`,
      first: `${baseUrl}?page=1&limit=${limitNum}`,
      last: `${baseUrl}?page=${Math.ceil(total / limitNum)}&limit=${limitNum}`,
    };
    
    if (pageNum > 1) links.prev = `${baseUrl}?page=${pageNum - 1}&limit=${limitNum}`;
    if (pageNum < Math.ceil(total / limitNum)) links.next = `${baseUrl}?page=${pageNum + 1}&limit=${limitNum}`;
    
    res.set('Cache-Control', 'public, max-age=300'); // Cache 5 minutes
    res.status(200).json({ 
      success: true, 
      count: blogs.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: blogs,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách blog' });
  }
};

// Lấy chi tiết 1 bài viết theo ID (Đã thêm populate)
const getBlogById = async (req, res) => {
  try {
    console.log('Getting blog with ID:', req.params.id);
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');
    console.log('Blog found:', !!blog);
    if (blog) console.log('Blog author:', blog.author);
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}/${blog._id}`,
      collection: `${baseUrl}`,
      author: blog.author ? `${req.protocol}://${req.get('host')}/api/users/${blog.author._id}` : null,
      reviews: `${req.protocol}://${req.get('host')}/api/reviews/blog/${blog._id}`
    };
    
    res.set('Cache-Control', 'public, max-age=300'); // Cache 5 minutes
    res.status(200).json({ 
      success: true, 
      data: blog,
      _links: links
    });
  } catch (error) {
    console.error('Error getting blog:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết blog' });
  }
};

// Tạo bài viết mới (dành cho admin)
const createBlog = async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json({ success: true, message: 'Tạo bài viết thành công', data: savedBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo bài viết', error: error.message });
  }
};

// Cập nhật bài viết
const updateBlog = async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết để cập nhật' });
    }
    res.status(200).json({ success: true, message: 'Cập nhật bài viết thành công', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật bài viết', error: error.message });
  }
};

// Xóa bài viết
const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết để xóa' });
    }
    res.status(200).json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa bài viết', error: error.message });
  }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };