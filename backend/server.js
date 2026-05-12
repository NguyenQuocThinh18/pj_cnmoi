const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const cron = require('node-cron'); 
const Booking = require('./models/Booking.js'); 
const Chat = require('./models/Chat.js'); 

// --- 1. IMPORT THƯ VIỆN HTTP, SOCKET.IO VÀ AI (MỚI) ---
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 

// Import Routes
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const reviewRoutes = require('./routes/reviewRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
// 👇 ĐÃ THÊM: Import Route Thanh toán VNPay
const paymentRoutes = require('./routes/paymentRoutes'); 

dotenv.config({ path: './.env' });
connectDB();

const app = express();

// --- 2. BỌC APP BẰNG HTTP SERVER VÀ KHỞI TẠO SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép mọi Frontend kết nối tới
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors()); 
app.use(express.json()); 

// ROUTES
app.use('/api/auth', authRoutes); 
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes); 
app.use('/api/reviews', reviewRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);
// 👇 ĐÃ THÊM: Khai báo đường dẫn API cho VNPay
app.use('/api/payment', paymentRoutes);

// =====================================================================
// 🤖 API: TRỢ LÝ AI TƯ VẤN DU LỊCH (GEMINI)
// =====================================================================
app.post('/api/chat/ai', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Khởi tạo model AI với API Key từ file .env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Tạo bối cảnh (Prompt) ép AI đóng vai nhân viên công ty bạn
    const prompt = `
      Bạn là trợ lý ảo của công ty "Du Lịch Việt". Tên bạn là "VietBot".
      Nhiệm vụ của bạn là tư vấn du lịch lịch sự, ngắn gọn (dưới 100 chữ) và thân thiện.
      Khách hàng vừa hỏi: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.status(200).json({ success: true, text: responseText });
  }catch (error) {
    console.error("❌ Lỗi chi tiết thông tin:", error.message); // Hiện lỗi thật ra Terminal
    res.status(500).json({
      success: false,
      error: error.message, // Gửi lỗi thật về frontend để bạn xem
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
// 💬 BỘ NÃO CỦA CHAT REAL-TIME (ĐÃ FIX THÀNH PRIVATE ROOMS)
// =========================================================
io.on('connection', (socket) => {
  console.log(`⚡ Một thiết bị vừa kết nối Chat (ID: ${socket.id})`);

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
    console.log(`❌ Thiết bị đã ngắt kết nối Chat (ID: ${socket.id})`);
  });
});

app.get('/', (req, res) => {
  res.send('API Du lịch đang hoạt động!');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server & AI Bot & Chat Socket.io đang chạy trên cổng ${PORT}...`);
});
