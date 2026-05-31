/*
 * tourController_new.js
 * Phiên bản bổ sung hoặc logic tour mới.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const Tour = require('../models/Tour');

// Lấy tất cả tours (hỗ trợ search/filter qua query params)
const getAllTours = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const tours = await Tour.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Tour.countDocuments(query);

    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}?${new URLSearchParams(req.query).toString()}`,
      first: `${baseUrl}?page=1&limit=${limitNum}`,
      last: `${baseUrl}?page=${Math.ceil(total / limitNum)}&limit=${limitNum}`,
    };

    if (pageNum > 1) links.prev = `${baseUrl}?page=${pageNum - 1}&limit=${limitNum}`;
    if (pageNum < Math.ceil(total / limitNum)) links.next = `${baseUrl}?page=${pageNum + 1}&limit=${limitNum}`;

    res.set('Cache-Control', 'private, max-age=300'); // Cache 5 minutes
    res.status(200).json({
      success: true,
      count: tours.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: tours,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tour' });
  }
};

// Tạo tour mới (Admin)
const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    res.status(201).json({ success: true, data: savedTour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi tạo tour' });
  }
};

// Lấy chi tiết 1 tour theo ID
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour không tồn tại' });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy chi tiết tour' });
  }
};

// Cập nhật thông tin tour (Admin)
const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTour) {
      return res.status(404).json({ success: false, message: 'Tour không tồn tại' });
    }
    res.status(200).json({ success: true, data: updatedTour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật tour' });
  }
};

// Xóa tour (Admin)
const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return res.status(404).json({ success: false, message: 'Tour không tồn tại' });
    }
    res.status(200).json({ success: true, message: 'Tour đã được xóa' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa tour' });
  }
};

module.exports = {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour
};