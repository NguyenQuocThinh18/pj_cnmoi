/*
 * tourController.js
 * Xử lý CRUD tour du lịch và các truy vấn liên quan.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const Tour = require('../models/Tour');
const Booking = require('../models/Booking'); // Dùng để tính toán số ghế
const slugify = require('slugify');
const notificationService = require('../services/notificationService'); // Gửi push notifications 

// 1. [POST] /api/tours - Tạo tour mới (Admin hoặc Staff)
const createTour = async (req, res) => {
  try {
    // --- CHỐT CHẶN BẢO MẬT: Kiểm tra quyền Admin/Staff ---
    if (req.user && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Từ chối truy cập: Chỉ Admin hoặc Staff mới có quyền Thêm Tour!' });
    }

    const { title, city, price, duration, availableSeats, startDate, endDate, image, description, category } = req.body;
    
    const finalImage = image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500';
    if (!title || !city || !price || !duration || !availableSeats || !startDate || !endDate || !description || !category) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    
    if (isNaN(price) || isNaN(availableSeats)) {
      return res.status(400).json({ success: false, message: 'Giá và ghế phải là con số!' });
    }
    
    if (Number(price) < 0 || Number(availableSeats) < 0) {
      return res.status(400).json({ success: false, message: 'Giá không được âm, ghế >= 0!' });
    }
    
    if (!duration || duration.trim() === '') {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập thời lượng tour!' });
    }
    
    const newTour = new Tour({
      ...req.body,
      image: finalImage
    });
    const savedTour = await newTour.save();
    
    // 🔔 Gửi push notification về tour mới (ghi nhận kết quả để debug)
    let notificationResult = null;
    try {
      notificationResult = await notificationService.sendNewTourNotification({
        _id: savedTour._id,
        title: savedTour.title,
        price: savedTour.price,
        image: savedTour.image
      });
      console.log('Kết quả gửi notification tour mới:', notificationResult);
    } catch (notificationError) {
      console.error('Lỗi gửi notification tour mới:', notificationError);
      // Không throw error, vẫn trả về tour đã tạo
    }

    // Trả về thêm trường `notification` để client có thể thấy kết quả gửi (debug)
    res.status(201).json({ success: true, message: 'Tạo tour thành công!', data: savedTour, notification: notificationResult });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Tên tour đã tồn tại!' });
    res.status(500).json({ success: false, message: 'Lỗi khi tạo tour', error: error.message });
  }
};

// 2. [GET] /api/tours - Lấy danh sách tất cả các tour (Ai cũng xem được)
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find(); 
    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách tour' });
  }
};

// 3. [GET] /api/tours/:id - Lấy chi tiết 1 tour & TÍNH TOÁN CHỖ NGỒI (Ai cũng xem được)
const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    let tour;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      tour = await Tour.findById(id); 
    } else {
      tour = await Tour.findOne({ slug: id });
    }

    if (!tour) return res.status(404).json({ success: false, message: 'Không tìm thấy tour này' });

    // Tính toán tình trạng chỗ ngồi
    const bookings = await Booking.find({ tourId: tour._id, status: { $ne: 'cancelled' } });
    let paidSeats = 0;
    let pendingSeats = 0;

    bookings.forEach(b => {
      const seats = b.guestSize || 1; 
      if (b.status === 'paid') paidSeats += seats;
      else pendingSeats += seats; // pending
    });

    const totalSeats = tour.availableSeats; 
    const remainingSeats = totalSeats - paidSeats - pendingSeats;

    res.status(200).json({ 
      success: true, 
      data: tour,
      seatStats: {
        total: totalSeats,
        paid: paidSeats,
        pending: pendingSeats,
        remaining: remainingSeats > 0 ? remainingSeats : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy chi tiết tour' });
  }
};

// 4. [PUT] /api/tours/:id - Cập nhật thông tin tour (Admin hoặc Staff)
const updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    // --- CHỐT CHẶN BẢO MẬT ---
    if (req.user && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Từ chối truy cập: Chỉ Admin hoặc Staff mới có quyền Sửa Tour!' });
    }

    const { title, price, duration, availableSeats } = req.body;
    
    if (price !== undefined && (isNaN(price) || Number(price) < 0)) return res.status(400).json({ success: false, message: 'Giá không được âm!' });
    if (duration !== undefined && (!duration || duration.trim() === '')) return res.status(400).json({ success: false, message: 'Thời lượng tour không được để trống!' });
    if (availableSeats !== undefined && (isNaN(availableSeats) || Number(availableSeats) < 0)) return res.status(400).json({ success: false, message: 'Số ghế không được âm!' });

    if (title) req.body.slug = slugify(title, { lower: true, strict: true, locale: 'vi' });
    
    const updatedTour = await Tour.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    
    if (!updatedTour) return res.status(404).json({ success: false, message: 'Tour không tồn tại!' });
    
    res.status(200).json({ success: true, message: "Cập nhật tour thành công!", data: updatedTour });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Tên tour đã tồn tại!' });
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật tour", error: err.message });
  }
};

// 5. [DELETE] /api/tours/:id - Xóa tour (CHỈ ADMIN MỚI ĐƯỢC XÓA)
const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    // --- CHỐT CHẶN BẢO MẬT ---
    if (req.user && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Từ chối truy cập: Chỉ Admin hoặc Staff mới có quyền Xóa Tour!' });
    }

    await Tour.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Đã xóa tour thành công!" });
  } catch (err) {
    console.error('Lỗi khi xóa tour:', err);
    res.status(500).json({ success: false, message: "Lỗi khi xóa tour", error: err.message });
  }
};

// 6. [GET] /api/tours/search/getTourBySearch - Tìm kiếm tour
const getTourBySearch = async (req, res) => {
  try {
    const { city, title, category } = req.query;
    const query = {};
    if (city) query.city = new RegExp(city, "i");
    if (title) query.title = new RegExp(title, "i");
    if (category) query.category = new RegExp(category, "i");
    
    const tours = await Tour.find(query);
    res.status(200).json({ success: true, message: tours.length > 0 ? "Tìm thấy kết quả" : "Không tìm thấy tour phù hợp", count: tours.length, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi khi tìm kiếm", error: err.message });
  }
};

module.exports = { createTour, getAllTours, getTourById, updateTour, deleteTour, getTourBySearch };