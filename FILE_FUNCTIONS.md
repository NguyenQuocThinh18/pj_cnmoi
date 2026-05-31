# FILE_FUNCTIONS.md

Tài liệu này ghi lại chức năng chính của các file mã nguồn trong dự án `pj_cnmoi-main`.

## Root

- `package.json`
  - Chứa thông tin phụ thuộc của dự án, scripts và cấu hình chung.
- `Procfile`
  - Dùng khi deploy trên nền tảng PaaS, định nghĩa lệnh khởi chạy ứng dụng.
- `render.yaml`
  - Cấu hình deploy cho Render.
- `README.md`
  - Giới thiệu dự án, tính năng, cấu trúc thư mục và cách chạy.
- `CODE_NOTES.md`
  - Mô tả chức năng chính của các file trong dự án.
- `FILE_FUNCTIONS.md`
  - Danh sách file và mô tả chức năng của từng file này.

## Backend

### Cấu hình và entrypoint
- `backend/server.js`
  - Khởi tạo Express server, cấu hình middleware, kết nối MongoDB và đăng ký route.
- `backend/config/db.js`
  - Cài đặt kết nối MongoDB bằng Mongoose.

### Routes
- `backend/routes/authRoutes.js`
  - Định nghĩa các route xác thực: đăng ký, đăng nhập, quên mật khẩu.
- `backend/routes/blogRoutes.js`
  - Định nghĩa route CRUD cho blog.
- `backend/routes/bookingRoutes.js`
  - Route quản lý đặt tour/booking.
- `backend/routes/carRoutes.js`
  - Route quản lý xe thuê.
- `backend/routes/categoryRoutes.js`
  - Route quản lý danh mục tour.
- `backend/routes/paymentRoutes.js`
  - Route xử lý thanh toán giả lập.
- `backend/routes/rentalRoutes.js`
  - Route quản lý thuê xe/rental.
- `backend/routes/reviewRoutes.js`
  - Route quản lý đánh giá/review.
- `backend/routes/tourRoutes.js`
  - Route CRUD và tìm kiếm tour.
- `backend/routes/userRoutes.js`
  - Route quản lý người dùng.

### Controllers
- `backend/controllers/authController.js`
  - Xử lý đăng ký, đăng nhập và quên mật khẩu.
- `backend/controllers/blogController.js`
  - Xử lý tạo, lọc, đọc, cập nhật và xóa bài blog.
- `backend/controllers/bookingController.js`
  - Xử lý đặt tour, cập nhật booking và truy vấn booking theo user/admin.
- `backend/controllers/carController.js`
  - CRUD thông tin xe thuê.
- `backend/controllers/categoryController.js`
  - Quản lý danh mục tour.
- `backend/controllers/rentalController.js`
  - Xử lý logic thuê xe và trả xe.
- `backend/controllers/reviewController.js`
  - Tạo, lấy và xóa đánh giá.
- `backend/controllers/tourController.js`
  - Xử lý CRUD tour cơ bản.
- `backend/controllers/tourController_new.js`
  - Phiên bản bổ sung hoặc logic nâng cao cho tour.
- `backend/controllers/userController.js`
  - Quản lý người dùng, cập nhật thông tin và danh sách user.

### Models
- `backend/models/User.js`
  - Định nghĩa schema người dùng: email, password, role, thông tin cá nhân.
- `backend/models/Tour.js`
  - Định nghĩa schema tour: tên, giá, mô tả, lịch trình, hình ảnh.
- `backend/models/Booking.js`
  - Định nghĩa schema booking tour.
- `backend/models/Rental.js`
  - Định nghĩa schema thuê xe.
- `backend/models/Car.js`
  - Định nghĩa schema xe cho thuê.
- `backend/models/Blog.js`
  - Định nghĩa schema bài blog.
- `backend/models/Review.js`
  - Định nghĩa schema đánh giá và bình luận.
- `backend/models/Category.js`
  - Định nghĩa schema danh mục tour.
- `backend/models/Chat.js`
  - Định nghĩa schema chat nếu cần lưu lịch sử trò chuyện.

### Scripts hỗ trợ
- `backend/seed.js`
  - Script seed dữ liệu cơ bản cho database.
- `backend/seedTours.js`
  - Script seed tour.
- `backend/seedCategories.js`
  - Script seed danh mục.
- `backend/seedBlogs.js`
  - Script seed blog.
- `backend/checkBlogs.js`
  - Kiểm tra dữ liệu blog hoặc thao tác hỗ trợ.

### Middleware
- `backend/middleware/verifyToken.js`
  - Kiểm tra JWT và phân quyền người dùng.

## Frontend

### Cấu hình
- `frontend/vite.config.js`
  - Cấu hình Vite cho frontend.
- `frontend/tailwind.config.js`
  - Cấu hình Tailwind CSS.
- `frontend/eslint.config.js`
  - Cấu hình ESLint cho frontend.

### Entry
- `frontend/src/main.jsx`
  - Khởi tạo React app và render `App`.
- `frontend/src/App.jsx`
  - Định nghĩa routes ứng dụng, layout chung với Navbar, Footer và ChatWidget.

### Utils
- `frontend/src/utils/apiConfig.js`
  - Chứa cấu hình base URL API và socket.
- `frontend/src/utils/imagePath.js`
  - Chuyển đổi đường dẫn ảnh.

### Components chung
- `frontend/src/components/Navbar.jsx`
  - Thanh điều hướng và trạng thái đăng nhập.
- `frontend/src/components/Footer.jsx`
  - Footer trang web.
- `frontend/src/components/ProtectedRoute.jsx`
  - Bảo vệ route chỉ cho người dùng hợp lệ.
- `frontend/src/components/ChatWidget.jsx`
  - Widget chat, đã ẩn tùy chọn Chat với AI và giữ lại Chat với Nhân viên.
- `frontend/src/components/TicketModal.jsx`
  - Modal hiển thị vé hoặc thông tin vé.

### Trang (pages)
- `frontend/src/pages/Home.jsx`
  - Trang chủ và hiển thị nội dung nổi bật.
- `frontend/src/pages/Login.jsx`
  - Form đăng nhập.
- `frontend/src/pages/Register.jsx`
  - Form đăng ký.
- `frontend/src/pages/ForgotPassword.jsx`
  - Trang khôi phục mật khẩu, hiện hoạt động giả lập gửi yêu cầu thành công.
- `frontend/src/pages/TourList.jsx`
  - Danh sách tour và lọc.
- `frontend/src/pages/TourDetails.jsx`
  - Trang chi tiết tour.
- `frontend/src/pages/Blog.jsx`
  - Danh sách bài blog.
- `frontend/src/pages/BlogDetail.jsx`
  - Chi tiết 1 bài blog.
- `frontend/src/pages/Blogs.jsx`
  - Trang blog chính.
- `frontend/src/pages/Contact.jsx`
  - Form liên hệ.
- `frontend/src/pages/About.jsx`
  - Trang giới thiệu.
- `frontend/src/pages/Pricing.jsx`
  - Trang giới thiệu giá gói.
- `frontend/src/pages/Policy.jsx`
  - Trang chính sách.
- `frontend/src/pages/OrderTracking.jsx`
  - Trang tra cứu đơn hàng.
- `frontend/src/pages/PaymentSandbox.jsx`
  - Trang thanh toán giả lập.
- `frontend/src/pages/PaymentResult.jsx`
  - Trang kết quả thanh toán.
- `frontend/src/pages/MyBookings.jsx`
  - Trang danh sách booking của người dùng.
- `frontend/src/pages/Dashboard.jsx`
  - Trang dashboard chung.
- `frontend/src/pages/AdminDashboard.jsx`
  - Dashboard admin quản lý tour, booking và user.
- `frontend/src/pages/Account.jsx`
  - Trang thông tin tài khoản người dùng.
- `frontend/src/pages/Ticket.jsx`
  - Trang/vé hiển thị thông tin vé.

### Public assets hỗ trợ
- `frontend/public/assets/js/*.js`
  - Các script JavaScript cũ dùng cho trang tĩnh hoặc tài nguyên web.
- `frontend/public/assets/css/*.css`
  - File CSS tĩnh cho từng trang và layout.

## Ghi chú
Tệp `FILE_FUNCTIONS.md` giúp bạn nhanh chóng biết từng file code có chức năng gì mà không phải mở từng file.
