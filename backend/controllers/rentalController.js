const Rental = require('../models/Rental');

// Khách hàng gửi yêu cầu (Không cần đăng nhập)
exports.createRental = async (req, res) => {
    try {
        const newRental = new Rental(req.body);
        await newRental.save();
        res.status(201).json({ success: true, message: 'Gửi yêu cầu thuê xe thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi gửi yêu cầu' });
    }
};

// Admin/Staff lấy danh sách
exports.getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: rentals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Admin/Staff cập nhật trạng thái (đã gọi điện tư vấn)
exports.updateRentalStatus = async (req, res) => {
    try {
        await Rental.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.status(200).json({ success: true, message: 'Cập nhật thành công!' });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// Admin/Staff xóa yêu cầu
exports.deleteRental = async (req, res) => {
    try {
        await Rental.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa thành công!' });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};