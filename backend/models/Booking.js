/*
 * Booking.js
 * Mongoose model cho dữ liệu Booking.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    guestSize: {
      type: Number,
      required: true,
      min: 1, // Ít nhất phải có 1 người đi
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'pending_confirmation', 'paid', 'cancelled'], // pending: Chờ thanh toán; pending_confirmation: chờ xác nhận; paid: Đã thanh toán
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'sandbox', 'vnpay'], // sandbox/vnpay là phương thức thanh toán giả lập/online
      default: 'sandbox',
    }
  },
  {
    timestamps: true, // Tự động lưu ngày giờ đặt tour
  }
);

module.exports = mongoose.model('Booking', bookingSchema);