/*
 * bookingController.js
 * Xử lý dữ liệu đặt tour, cập nhật và truy vấn đơn hàng.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const User = require('../models/User'); 

const createBooking = async (req, res) => {
  try {
    const { tourId, userId, guestSize, totalPrice, name, email, phone, paymentMethod } = req.body;
    if (!tourId || !guestSize || !totalPrice || (!userId && !name)) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt tour. Vui lòng cung cấp tour, số khách, tổng tiền và thông tin khách hàng.' });
    }

    const bookingData = {
      tourId,
      guestSize,
      totalPrice,
      paymentMethod: paymentMethod || 'cash',
      status: paymentMethod === 'cash' ? 'paid' : 'pending',
    };

    if (userId) {
      bookingData.userId = userId;
      const foundUser = await User.findById(userId);
      if (foundUser) {
        bookingData.name = name || foundUser.name;
        bookingData.email = email || foundUser.email;
        bookingData.phone = phone || foundUser.phone;
      }
    } else {
      if (name) bookingData.name = name;
      if (email) bookingData.email = email;
      if (phone) bookingData.phone = phone;
    }

    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();
    res.status(201).json({ success: true, message: 'Đặt tour thành công! Vui lòng tiến hành thanh toán.', data: savedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi đặt tour', error: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { code, phone, status, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (code || phone) {
      const queryVal = code || phone;
      const cleanQuery = queryVal.replace(/#/g, '').replace(/\s+/g, '').toLowerCase();
      
      const allBookings = await Booking.find()
        .populate('tourId', 'title image duration price')
        .populate('userId')
        .sort({ createdAt: -1 });
      
      const filteredBookings = allBookings.filter(b => {
        const idMatch = String(b._id).toLowerCase().includes(cleanQuery);
        const bPhone = b.phone ? String(b.phone).replace(/\D/g, '') : '';
        const uPhone = b.userId?.phone ? String(b.userId.phone).replace(/\D/g, '') : '';
        const phoneMatch = bPhone.includes(cleanQuery) || uPhone.includes(cleanQuery);
        return idMatch || phoneMatch;
      });
      
      if (filteredBookings.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: `Không tìm thấy đơn hàng với từ khóa [${cleanQuery}]` 
        });
      }
      
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      const links = {
        self: `${baseUrl}?${new URLSearchParams(req.query).toString()}`,
        collection: `${baseUrl}`
      };
      
      res.set('Cache-Control', 'private, max-age=0'); 
      return res.status(200).json({ 
        success: true, 
        count: filteredBookings.length,
        data: filteredBookings,
        _links: links
      });
    }
    
    if (status) query.status = status;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('tourId', 'title price duration availableSeats startDate endDate itinerary')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const total = await Booking.countDocuments(query);
    
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}?${new URLSearchParams(req.query).toString()}`,
      first: `${baseUrl}?page=1&limit=${limitNum}`,
      last: `${baseUrl}?page=${Math.ceil(total / limitNum)}&limit=${limitNum}`,
    };
    
    if (pageNum > 1) links.prev = `${baseUrl}?page=${pageNum - 1}&limit=${limitNum}`;
    if (pageNum < Math.ceil(total / limitNum)) links.next = `${baseUrl}?page=${pageNum + 1}&limit=${limitNum}`;
    
    res.set('Cache-Control', 'private, max-age=60'); 
    res.status(200).json({ 
      success: true, 
      count: bookings.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: bookings,
      _links: links
    });
  } catch (error) { 
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách booking' }); 
  }
};

const updateBooking = async (req, res) => {
  try {
    const { paymentMethod, status } = req.body;
    
    let updateData = {};
    
    if (paymentMethod) {
      updateData.status = paymentMethod === 'cash' ? 'pending_confirmation' : 'paid';
    }
    
    if (status) {
      updateData.status = status;
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt tour' });
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}/${updatedBooking._id}`,
      collection: `${baseUrl}`,
      tour: `${req.protocol}://${req.get('host')}/api/tours/${updatedBooking.tourId}`
    };
    
    res.status(200).json({ 
      success: true, 
      message: 'Cập nhật thành công', 
      data: updatedBooking,
      _links: links
    });
  } catch (error) { 
    res.status(500).json({ success: false, message: 'Lỗi cập nhật', error: error.message }); 
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    let findQuery = { userId: userId };
    if (mongoose.Types.ObjectId.isValid(userId)) {
      findQuery = {
        $or: [
          { userId: userId },
          { userId: new mongoose.Types.ObjectId(userId) }
        ]
      };
    }

    const bookings = await Booking.find(findQuery)
      .populate('tourId', 'title image price duration')
      .sort({ createdAt: -1 }); 
    
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}/user/${userId}`,
      collection: `${baseUrl}`,
      user: `${req.protocol}://${req.get('host')}/api/users/${userId}`
    };
    
    res.set('Cache-Control', 'private, max-age=60'); 
    res.status(200).json({ 
      success: true, 
      data: bookings,
      _links: links
    });
  } catch (error) { 
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử đặt tour' }); 
  }
};

// =========================================================================
// ⚡ ĐÃ BỔ SUNG: HÀM XỬ LÝ ĐIỂM DANH CHECK-IN BẰNG QUÉT QR
// =========================================================================
const checkInBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: { checkedIn: true } },
      { new: true }
    ).populate('tourId');

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mã đơn đặt tour này trên hệ thống!' });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Check-in thành công cho đoàn khách: ${updatedBooking.name || 'Khách hàng'}!`, 
      data: updatedBooking 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xử lý Check-in', error: error.message });
  }
};

// Xuất thêm checkInBooking ra ngoài
module.exports = { createBooking, getAllBookings, updateBooking, getUserBookings, checkInBooking };