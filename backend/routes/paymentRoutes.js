/*
 * paymentRoutes.js
 * Router Express định nghĩa endpoint cho payment.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const router = express.Router();
const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');
const nodemailer = require('nodemailer'); // IMPORT THƯ VIỆN GỬI MAIL
const Booking = require('../models/Booking');

// --- CẤU HÌNH BỘ GỬI EMAIL ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. API TẠO LINK THANH TOÁN VNPAY
router.post('/create_payment_url', async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
    
    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;

    let bookingId = req.body.bookingId;
    let amount = req.body.amount;
    let bankCode = req.body.bankCode || ''; // Có thể truyền 'NCB' để test

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = bookingId; // Mã đơn hàng
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don dat tour ' + bookingId;
    vnp_Params['vnp_OrderType'] = 'billpayment';
    vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu nhân 100
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp tham số
    vnp_Params = sortObject(vnp_Params);

    // Tạo chữ ký (Hash)
    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
    
    res.status(200).json({ success: true, paymentUrl: vnpUrl });
});

// 2. API CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG VÀ GỬI EMAIL KHI VNPAY TRẢ VỀ
router.post('/update-status', async (req, res) => {
    try {
        const { bookingId, vnp_ResponseCode } = req.body;
        
        if (vnp_ResponseCode === '00') {
            // Lấy thông tin đơn hàng ra trước (kèm theo thông tin Tour)
            const booking = await Booking.findById(bookingId).populate('tourId');
            
            if (booking && booking.status !== 'paid') {
                // Cập nhật trạng thái thành đã thanh toán
                booking.status = 'paid';
                booking.paymentMethod = 'vnpay';
                await booking.save();

                // NẾU CÓ EMAIL KHÁCH HÀNG THÌ BẮN MAIL TỰ ĐỘNG
                const customerEmail = booking.email || booking.userId?.email;
                if (customerEmail) {
                    const mailOptions = {
                        from: `"Du Lịch Việt" <${process.env.EMAIL_USER}>`,
                        to: customerEmail,
                        subject: `🎉 Xác nhận thanh toán thành công - Mã đơn #${bookingId.substring(18).toUpperCase()}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
                                <div style="text-align: center; margin-bottom: 20px;">
                                    <h2 style="color: #198754; margin: 0;">THANH TOÁN THÀNH CÔNG!</h2>
                                </div>
                                <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <p>Chào <strong>${booking.name || 'Quý khách'}</strong>,</p>
                                    <p>Cảm ơn bạn đã tin tưởng và đặt tour tại Du Lịch Việt. Chúng tôi xin xác nhận đơn hàng của bạn đã được thanh toán đầy đủ qua cổng VNPAY.</p>
                                    <hr style="border-top: 1px dashed #ccc; margin: 20px 0;" />
                                    <h3 style="color: #0dcaf0; margin-top: 0;">🎫 THÔNG TIN VÉ ĐIỆN TỬ</h3>
                                    <ul style="line-height: 1.8;">
                                        <li><strong>Tên Tour:</strong> ${booking.tourId?.title || 'Đang cập nhật'}</li>
                                        <li><strong>Số lượng khách:</strong> ${booking.guestSize} người</li>
                                        <li><strong>Tổng tiền đã thu:</strong> <span style="color: #dc3545; font-weight: bold;">${booking.totalPrice.toLocaleString('vi-VN')} VNĐ</span></li>
                                        <li><strong>Mã đơn hàng:</strong> #${bookingId.substring(18).toUpperCase()}</li>
                                    </ul>
                                    <p>Vui lòng giữ lại email này để đối chiếu khi lên xe. Chúc bạn có một chuyến đi thật vui vẻ!</p>
                                </div>
                                <p style="font-size: 12px; color: #777; text-align: center; margin-top: 20px;">Đây là email tự động từ hệ thống, vui lòng không trả lời.</p>
                            </div>
                        `
                    };
                    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) console.log('❌ Lỗi gửi email:', error);
                        else console.log('✅ Đã gửi Email vé điện tử cho khách: ' + info.response);
                    });
                }
            }
            res.json({ success: true, message: 'Cập nhật thanh toán và gửi mail thành công' });
        } else {
            res.json({ success: false, message: 'Thanh toán thất bại hoặc đã hủy' });
        }
    } catch (error) {
        console.error("Lỗi API Update Status:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Hàm hỗ trợ sắp xếp theo chuẩn VNPay
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) str.push(encodeURIComponent(key));
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;