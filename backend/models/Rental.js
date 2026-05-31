/*
 * Rental.js
 * Mongoose model cho dữ liệu Rental.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    endDate: { type: String, required: true },
    carType: { type: String, required: true },
    destination: { type: String, required: true },
    rentalType: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'processed'] }, // pending: Chờ xử lý, processed: Đã xử lý
    notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);