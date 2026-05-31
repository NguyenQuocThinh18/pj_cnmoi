/*
 * reviewController.js
 * Quản lý bình luận đánh giá và xóa review không phù hợp.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const Review = require('../models/Review');

// Gửi đánh giá mới
const createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json({ success: true, message: 'Gửi thành công!', data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi gửi dữ liệu', error: error.message });
  }
};

// Lấy đánh giá Tour
const getTourReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tourId: req.params.tourId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}/${req.params.tourId}`,
      tour: `${req.protocol}://${req.get('host')}/api/tours/${req.params.tourId}`,
      collection: `${baseUrl.replace('/reviews', '')}`
    };
    
    res.set('Cache-Control', 'public, max-age=300'); // Cache 5 minutes
    res.status(200).json({ 
      success: true, 
      data: reviews,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải đánh giá Tour' });
  }
};

// Lấy bình luận Blog
const getBlogReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ blogId: req.params.blogId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}/blog/${req.params.blogId}`,
      blog: `${req.protocol}://${req.get('host')}/api/blogs/${req.params.blogId}`,
      collection: `${baseUrl.replace('/reviews', '')}`
    };
    
    res.set('Cache-Control', 'public, max-age=300'); // Cache 5 minutes
    res.status(200).json({ 
      success: true, 
      data: reviews,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải bình luận Blog' });
  }
};

// Lấy tất cả cho Admin Dashboard
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name')
      .populate('tourId', 'title')
      .populate('blogId', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải dữ liệu quản trị' });
  }
};

const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Đã xóa!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xóa' });
  }
};

module.exports = { createReview, getTourReviews, getBlogReviews, getAllReviews, deleteReview };