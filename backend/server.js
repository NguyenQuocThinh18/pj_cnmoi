/*
 * server.js
 * Entrypoint của server backend. Thiết lập Express, middleware, routes và khởi động port.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const cron = require('node-cron'); 
const Booking = require('./models/Booking.js'); 
const Chat = require('./models/Chat.js'); 

// --- 1. IMPORT THƯ VIỆN HTTP, SOCKET.IO VÀ AI ---
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 

// --- IMPORT CÁC ĐƯỜNG DẪN API (ROUTES) ---
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const blogRoutes = require('./routes/blogRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const carRoutes = require('./routes/carRoutes'); // 👈 Route Quản lý Kho Xe
const paymentRoutes = require('./routes/paymentRoutes'); // 👈 Route Thanh toán VNPay / Chuyển khoản tự động
const notificationRoutes = require('./routes/notificationRoutes'); // 👈 Route Push Notifications
const versionRoutes = require('./routes/versionRoutes'); // 👈 Route Quản lý Version App

dotenv.config({ path: './.env' });
connectDB();

const app = express();

// --- 2. BỌC APP BẰNG HTTP SERVER VÀ KHỞI TẠO SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép mọi Frontend kết nối tới (Tránh lỗi CORS)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// 🚀 QUAN TRỌNG: Gán io vào app để các file Route (như rentalRoutes) có thể lấy ra dùng để báo động
app.set('io', io);

// --- 3. MIDDLEWARE CƠ BẢN ---
app.use(cors()); 
app.use(express.json({ limit: '50mb' })); // Tăng limit để upload được ảnh Base64
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- 4. KHAI BÁO SỬ DỤNG API ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/reviews', reviewRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/cars', carRoutes); // 👈 Kích hoạt API Kho Xe
app.use('/api/payment', paymentRoutes); // 👈 Kích hoạt API Thanh toán
app.use('/api/notifications', notificationRoutes); // 👈 Kích hoạt API Push Notifications
app.use('/api/versions', versionRoutes); // 👈 Kích hoạt API Quản lý Version

// =====================================================================
// 🤖 API: TRỢ LÝ AI TƯ VẤN DU LỊCH (GEMINI)
// =====================================================================
app.post('/api/chat/ai', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Khởi tạo model AI với API Key từ file .env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Nâng cấp lên model Flash nhanh hơn

    // Tạo bối cảnh (Prompt) ép AI đóng vai nhân viên công ty bạn
    const prompt = `
      Bạn là trợ lý ảo của công ty "Du Lịch Việt". Tên bạn là "VietBot".
      Nhiệm vụ của bạn là tư vấn du lịch lịch sự, ngắn gọn (dưới 100 chữ) và thân thiện.
      Khách hàng vừa hỏi: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.status(200).json({ success: true, text: responseText });
  } catch (error) {
    console.error("❌ Lỗi AI Bot:", error.message); 
    res.status(500).json({
      success: false,
      error: error.message, 
      text: "Lỗi hệ thống: " + error.message
    });
  }
});

// =====================================================================
// 💬 API LẤY LỊCH SỬ CHAT CHO FRONTEND
// =====================================================================
app.get('/api/chat', async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: 1 }).limit(50);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải lịch sử chat' });
  }
});

// =====================================================================
// 🤖 CRON JOB: HỆ THỐNG TỰ ĐỘNG HỦY ĐƠN & NHẢ GHẾ SAU 5 PHÚT
// =====================================================================
cron.schedule('* * * * *', async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = await Booking.updateMany(
      {
        status: 'pending', 
        createdAt: { $lte: fiveMinutesAgo }
      },
      {
        $set: { status: 'cancelled' } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`🤖 [HỆ THỐNG] Đã tự động hủy và thu hồi ghế của ${result.modifiedCount} đơn đặt tour quá hạn 5 phút.`);
    }
  } catch (error) {
    console.error("❌ Lỗi khi chạy Cron Job hủy đơn:", error);
  }
});

// =========================================================
// 💬 BỘ NÃO CỦA CHAT REAL-TIME (TÍCH HỢP TƯ VẤN KHÁCH & ADMIN BÁO ĐỘNG)
// =========================================================
io.on('connection', (socket) => {
  console.log(`⚡ Một thiết bị vừa kết nối Socket (ID: ${socket.id})`);

  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(`👤 Thiết bị ${socket.id} đã vào phòng: ${roomName}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const newMsg = new Chat(data);
      await newMsg.save();
      socket.to(data.room).emit('receive_message', data); 
    } catch (error) {
      console.error("❌ Lỗi khi lưu tin nhắn vào DB:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Thiết bị đã ngắt kết nối (ID: ${socket.id})`);
  });
});

app.get('/', (req, res) => {
  res.send('API Hệ thống Du Lịch Việt đang hoạt động ổn định! 🚀');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server Backend & AI Bot & Socket.io đang chạy trên cổng ${PORT}...`);
});