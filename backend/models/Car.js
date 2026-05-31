/*
 * Car.js
 * Mongoose model cho dữ liệu Car.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên dòng xe (Xe 4-7 Chỗ, Xe 16 Chỗ, etc)
    carType: { type: String, required: true }, // Loại xe (Sedan, Van, Bus)
    seats: { type: Number, required: true }, // Số ghế
    pricePerDay: { type: Number, required: true }, // Giá/ngày
    description: { type: String, default: '' }, // Mô tả xe
    image: { type: String, default: '' }, // Ảnh xe (base64 hoặc URL)
    features: [{ type: String }], // Tính năng (VD: ["WiFi", "Điều hòa", "Ghế da"])
    status: { type: String, default: 'available', enum: ['available', 'maintenance', 'rented'] }, // Trạng thái
    licensePlate: { type: String, unique: true, sparse: true }, // Biển số xe
    manufacturer: { type: String, default: '' }, // Hãng sản xuất
    yearManufactured: { type: Number, default: new Date().getFullYear() }, // Năm sản xuất
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
