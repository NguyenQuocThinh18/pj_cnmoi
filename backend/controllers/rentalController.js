/*
 * rentalController.js
 * Xử lý phiếu thuê xe và trạng thái thuê.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const Rental = require('../models/Rental');
const nodemailer = require('nodemailer');

// --- CẤU HÌNH HỆ THỐNG GỬI EMAIL TỰ ĐỘNG ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify email config
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ [Email Config] Lỗi cấu hình:', error.message);
    } else {
        console.log('✅ [Email Config] Đã sẵn sàng gửi email');
    }
});

// 1. [CREATE] Khách hàng gửi yêu cầu tự động hoặc Admin thêm thủ công từ văn phòng
exports.createRental = async (req, res) => {
    try {
        const { name, phone, email, carType, date, endDate, destination, rentalType } = req.body;

        if (!name || !phone || !email || !carType || !date || !endDate || !destination || !rentalType) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin yêu cầu thuê xe!' });
        }

        const newRental = new Rental({
            name, phone, email, carType, date, endDate, destination, rentalType,
            status: 'pending' // Mặc định: Chờ gọi điện tư vấn
        });
        const savedRental = await newRental.save();

        // 🚀 BẮN THÔNG BÁO THỜI GIAN THỰC QUA SOCKET.IO CHO TRANG ADMIN
        const io = req.app.get('io');
        if (io) {
            io.emit('new-rental-request', savedRental);
        }

        // 📬 TỰ ĐỘNG GỬI EMAIL THUYẾT MINH LỘ TRÌNH VÀ VÉ XE CHO KHÁCH
        const mailOptions = {
            from: `"Du Lịch Việt - Phòng Điều Hành Xe" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🚗 Phiếu đăng ký thuê xe du lịch thành công - Du Lịch Việt`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #0ea5e9; margin: 0;">TIẾP NHẬN ĐĂNG KÝ THUÊ XE</h2>
                    </div>
                    <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p>Chào <strong>${name}</strong>,</p>
                        <p>Hệ thống vận tải Du Lịch Việt xin thông báo phiếu yêu cầu thuê xe trực tuyến của bạn đã được ghi nhận thành công trên hệ thống:</p>
                        <hr style="border-top: 1px dashed #ccc; margin: 15px 0;" />
                        <ul style="line-height: 2; list-style-type: none; padding-left: 0;">
                            <li>📦 <strong>Dòng xe lựa chọn:</strong> ${carType}</li>
                            <li>🗺️ <strong>Lộ trình / Điểm đến:</strong> ${destination}</li>
                            <li>⚙️ <strong>Hình thức thuê xe:</strong> ${rentalType === 'self' ? 'Thuê xe tự lái' : 'Có tài xế chuyên nghiệp phục vụ'}</li>
                            <li>📅 <strong>Thời gian di chuyển:</strong> Từ ngày ${date} đến hết ngày ${endDate}</li>
                        </ul>
                        <hr style="border-top: 1px dashed #ccc; margin: 15px 0;" />
                        <p>Đội ngũ nhân viên điều hành bến xe của chúng tôi sẽ gọi điện thoại trực tiếp qua SĐT <strong style="color: #dc3545;">${phone}</strong> trong vòng 15 phút tới để báo giá chi tiết, chốt lịch trình và hỗ trợ bạn làm hợp đồng bến bãi.</p>
                    </div>
                    <p style="font-size: 11px; color: #777; text-align: center; margin-top: 20px;">Đây là email tự động từ máy chủ điều phối, xin vui lòng không trả lời thư này.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log('❌ Lỗi gửi email thuê xe:', error);
            else console.log('✅ Đã gửi email xác nhận cho khách hàng:', email);
        });

        return res.status(201).json({ success: true, message: 'Gửi yêu cầu thuê xe thành công!', data: savedRental });
    } catch (error) {
        console.error('❌ [createRental] Lỗi chi tiết:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Lỗi khi gửi yêu cầu', error: error.message });
    }
};

// 2. [READ] Admin/Staff lấy danh sách toàn bộ phiếu thuê xe
exports.getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: rentals });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server không lấy được danh sách xe' });
    }
};

// 3. [UPDATE] ĐĂNG CẤP MỚI: Cho phép cập nhật toàn bộ body (Dùng cho cả đổi trạng thái và sửa thông tin)
exports.updateRentalStatus = async (req, res) => {
    try {
        const updatedRental = await Rental.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        
        if (!updatedRental) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu xe cần sửa' });
        }
        
        res.status(200).json({ success: true, message: 'Cập nhật thông tin thuê xe thành công!', data: updatedRental });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi cập nhật phía server' });
    }
};

// 4. [DELETE] Admin/Staff xóa vĩnh viễn phiếu yêu cầu thuê xe khỏi hệ thống
exports.deleteRental = async (req, res) => {
    try {
        const deletedRental = await Rental.findByIdAndDelete(req.params.id);
        if (!deletedRental) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn để xóa' });
        }
        res.status(200).json({ success: true, message: 'Xóa phiếu thuê xe thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server khi thực hiện lệnh xóa' });
    }
};