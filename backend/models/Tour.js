/*
 * Tour.js
 * Mongoose model cho dữ liệu Tour.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    availableSeats: { type: Number, required: true },
    featured: { type: Boolean, default: false },
    
    // --- TRƯỜNG CŨ: Danh mục tour ---
    category: { type: String, default: "" }, 
    
    // --- TRƯỜNG MỚI THÊM (CHO BẢN ĐỒ LEAFLET) ---
    lat: { type: Number, default: 10.762622 }, // Vĩ độ (Mặc định: Chợ Bến Thành, TP.HCM)
    lng: { type: Number, default: 106.660172 }, // Kinh độ
    
    // Các trường bổ sung
    startDate: { type: String, default: 'Khởi hành hằng ngày' },
    endDate: { type: String, default: 'Theo lịch trình' },
    promotions: { type: [String], default: [] },
    itinerary: [{ day: String, title: String, description: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', tourSchema);