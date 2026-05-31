# CODE_NOTES.md

Tài liệu này mô tả chức năng chính của từng file trong dự án `pj_cnmoi-main` để bạn dễ theo dõi và giải thích code.

---

## 1. Tổng quan dự án

Đây là ứng dụng web quản lý tour du lịch theo mô hình **MERN** (MongoDB, Express, React, Node). Dự án gồm hai phần chính:
- `backend/`: server API, điều khiển dữ liệu và xác thực.
- `frontend/`: giao diện người dùng React + Bootstrap + Tailwind.

---

## 2. Root files

### `package.json`
- Chứa cấu hình `devDependencies` cho Tailwind CSS và PostCSS.
- File này nằm ở root nhưng không chứa scripts chạy frontend hoặc backend ở dạng hiện tại.

### `Procfile`
- Dùng để cấu hình ứng dụng khi triển khai trên một số dịch vụ PaaS.
- Thường chứa dòng lệnh để khởi chạy server.

### `render.yaml`
- Cấu hình deploy cho dịch vụ Render.
- Chứa thông tin build và deploy.

### `README.md`
- Chứa mô tả dự án, tính năng và cấu trúc thư mục.
- Đã được cập nhật để bổ sung thông tin về thay đổi mới: ẩn chat AI và giả lập khôi phục mật khẩu.

---

## 3. Backend

### `backend/server.js`
- Entrypoint của server Node/Express.
- Kết nối MongoDB, sử dụng middleware chung (CORS, JSON parser), định nghĩa route và khởi động port.

### `backend/routes/authRoutes.js`
- Định nghĩa đường dẫn API liên quan đến xác thực.
- Gồm 3 route chính: `/register`, `/login`, `/forgot-password`.

### `backend/controllers/authController.js`
- `register`: tạo người dùng mới trong MongoDB.
  - Kiểm tra nếu email tồn tại thì trả lỗi 400.
  - Lưu password đã mã hóa nhờ schema Mongoose với plugin bcrypt.
- `login`: xác thực email/password.
  - Tìm user, so sánh password bằng bcrypt.
  - Trả về JWT nếu đăng nhập thành công.
- `forgotPassword`: xử lý yêu cầu khôi phục mật khẩu.
  - Tìm user theo email.
  - Gửi email hướng dẫn đến địa chỉ người dùng nếu có cấu hình Gmail.
  - Nếu hệ thống chưa có giao diện reset thực tế thì email chỉ nội dung liên hệ lại bộ phận hỗ trợ.

### `backend/controllers/blogController.js`
- Xử lý CRUD bài viết blog.
- Thường gồm tạo bài viết mới, lấy danh sách blog, lấy chi tiết blog, sửa, xóa.

### `backend/controllers/bookingController.js`
- Xử lý dữ liệu đặt tour.
- Các chức năng thường gồm tạo booking, cập nhật trạng thái, lấy danh sách theo user/admin.

### `backend/controllers/carController.js`
- Quản lý danh sách xe thuê.
- CRUD thông tin xe.

### `backend/controllers/categoryController.js`
- Quản lý chuyên mục tour.
- Lấy danh sách category hoặc tạo mới.

### `backend/controllers/rentalController.js`
- Xử lý thuê xe/rental.
- Tạo phiếu thuê, cập nhật trạng thái, xóa phiếu.

### `backend/controllers/reviewController.js`
- Quản lý review/bình luận.
- Gồm tạo review, lấy review theo tour, xóa review không phù hợp.

### `backend/controllers/tourController.js`
### `backend/controllers/tourController_new.js`
- Xử lý logic tour.
- `tourController.js` thường chứa CRUD cơ bản tour.
- `tourController_new.js` có thể là phiên bản mới hoặc logic bổ sung cho lọc/tìm kiếm.

### `backend/controllers/userController.js`
- Quản lý người dùng.
- Lấy danh sách user, chỉnh sửa thông tin, thay đổi quyền, xóa user.

### `backend/models/*.js`
Các file model định nghĩa schema cho dữ liệu MongoDB dùng Mongoose.
- `User.js`: thông tin người dùng, email, password, phone, role.
- `Tour.js`: cấu trúc tour, giá, mô tả, hình ảnh, danh mục.
- `Booking.js`: dữ liệu đặt tour, khách hàng, tổng tiền, trạng thái.
- `Rental.js`: dữ liệu thuê xe.
- `Car.js`: dữ liệu xe cho thuê.
- `Blog.js`: dữ liệu bài viết blog.
- `Review.js`: bình luận sao, nội dung review.
- `Category.js`: danh mục tour.
- `Chat.js`: nếu có, dùng lưu chat hoặc lịch sử.

---

## 4. Frontend

### `frontend/src/main.jsx`
- Entrypoint React.
- Import Bootstrap CSS/JS và `App`.
- Render App vào thẻ DOM `#root`.

### `frontend/src/App.jsx`
- Cấu hình route của ứng dụng.
- Dùng `React Router` để điều hướng giữa các trang.
- Dùng `Suspense` để lazy load trang khi cần.
- Bao gồm `Navbar`, `Footer`, `ChatWidget` toàn ứng dụng.
- `ProtectedRoute` bảo vệ `/admin` chỉ cho admin đã đăng nhập.

### `frontend/src/utils/apiConfig.js`
- Định nghĩa `API_BASE_URL` dựa trên biến môi trường `VITE_API_URL`.
- Cấu hình mặc định `http://localhost:5000`.
- Xuất cấu hình axios và URL socket.

### `frontend/src/utils/imagePath.js`
- Chuyển đổi đường dẫn ảnh: có thể lấy ảnh từ backend hoặc public.
- Dùng để hiển thị hình tour/blog.

### `frontend/src/components/Navbar.jsx`
- Thanh điều hướng trên cùng.
- Liên kết tới các trang Home, Tour, Blog, Liên hệ, đăng nhập.
- Hiển thị nút đăng nhập/đăng ký hoặc thông tin user nếu đã đăng nhập.

### `frontend/src/components/Footer.jsx`
- Footer chung ở cuối trang.
- Chứa thông tin liên hệ, mạng xã hội, copyright.

### `frontend/src/components/ProtectedRoute.jsx`
- Kiểm tra token người dùng và role.
- Nếu user chưa đăng nhập hoặc không có quyền, chuyển hướng về trang login.

### `frontend/src/components/ChatWidget.jsx`
- Widget chat nổi trên giao diện.
- Hiện nút `Chat với Nhân viên` và `Chat với AI`.
- Đã chỉnh sửa để ẩn nút `Chat với AI` theo yêu cầu.
- Chứa chức năng mở/đóng widget và gửi tin nhắn.

### `frontend/src/components/TicketModal.jsx`
- Modal dùng hiển thị vé QR hoặc thông tin check-in.
- Thường dùng cho trang ticket/qr check-in.

---

## 5. Các trang chính ở `frontend/src/pages/`

### `Home.jsx`
- Trang chủ, hiển thị banner, tour nổi bật, đánh giá, liên hệ nhanh.
- Thường gọi API lấy các tour và blog.

### `Login.jsx`
- Form đăng nhập.
- Gửi email/password tới backend `/auth/login`.
- Lưu token nếu đăng nhập thành công.

### `Register.jsx`
- Form đăng ký người dùng mới.
- Gửi thông tin tới backend `/auth/register`.

### `ForgotPassword.jsx`
- Trang khôi phục mật khẩu.
- Hiện form nhập email.
- Hiện thông báo thành công giả lập khi bấm nút.
- Đã được cập nhật để luôn có phản hồi ngay cả khi backend/email chưa sẵn sàng.

### `TourList.jsx`
- Danh sách tour trong nước/quốc tế.
- Có thể lọc theo loại, tìm kiếm.

### `TourDetails.jsx`
- Trang chi tiết 1 tour.
- Hiển thị thông tin tour, mô tả, lịch trình, hình ảnh.
- Có form đặt tour hoặc liên hệ.

### `Blog.jsx` và `BlogDetail.jsx`
- `Blog.jsx`: danh sách bài viết.
- `BlogDetail.jsx`: nội dung chi tiết 1 bài viết.

### `Contact.jsx`
- Trang liên hệ với form gửi tin nhắn.

### `Pricing.jsx`, `Policy.jsx`, `About.jsx`
- Trang nội dung tĩnh cho giá gói, chính sách, giới thiệu.

### `OrderTracking.jsx`
- Trang tra cứu đơn hàng.
- Hiển thị kết quả khi nhập mã hoặc email.

### `PaymentSandbox.jsx` và `PaymentResult.jsx`
- `PaymentSandbox.jsx`: trang thanh toán giả lập.
- `PaymentResult.jsx`: trang hiển thị kết quả thanh toán.

### `Account.jsx`
- Trang quản lý tài khoản người dùng.
- Hiển thị thông tin profile và lịch sử đặt tour.

### `MyBookings.jsx`
- Trang danh sách đơn đặt tour của user.

### `Dashboard.jsx`
- Trang dashboard người dùng hoặc admin (không phải `AdminDashboard`).

### `AdminDashboard.jsx`
- Trang quản lý admin toàn diện.
- Dùng để quản lý tour, booking, rental, xe, blog, users.
- Chứa modal xem chi tiết, form tạo/sửa, thống kê.
- Được chỉnh sửa để thêm xác thực input, hạn chế ngày thuê xe, email hợp lệ.

### `Ticket.jsx`
- Trang hiển thị vé/quét QR.
- Có thể dùng cho chức năng check-in hoặc vé điện tử.

---

## 6. Ghi chú chi tiết cho các file đã chỉnh sửa gần đây

### `frontend/src/components/ChatWidget.jsx`
- Widget chat gồm menu lựa chọn giữa `Chat với Nhân viên` và `Chat với AI`.
- Nút `Chat với AI` đã bị ẩn theo yêu cầu.
- Nếu cần, phần này còn có thể chỉnh để ẩn toàn bộ widget chat.

### `frontend/src/pages/ForgotPassword.jsx`
- Ban đầu gửi request đến backend `/api/auth/forgot-password`.
- Khi backend không sẵn sàng, chức năng đã được chuyển sang giả lập: bấm nút là hiển thị thông báo thành công ngay.
- Giữ lại giao diện hiện tại và thêm note cho người dùng rằng đây là môi trường thử nghiệm.

### `frontend/src/pages/AdminDashboard.jsx`
- Quản lý form admin, bao gồm rental, staff booking, tour, users, blog.
- Đã thêm validation cho input phone, email, ngày bắt đầu/kết thúc thuê xe.
- Chứa nhiều state và xử lý modal, nên đây là file phức tạp nhất bên frontend hiện tại.

---

## 7. Hướng dẫn đọc tài liệu

- Nếu muốn hiểu nhanh, đọc `App.jsx` trước để nắm route.
- Tiếp theo đọc `backend/controllers/authController.js` để hiểu flow đăng nhập/đăng ký/forgot-password.
- Sau đó đọc `frontend/src/pages/ForgotPassword.jsx` và `frontend/src/components/ChatWidget.jsx` để nắm các phần đã cập nhật.
- `AdminDashboard.jsx` là nơi chứa nhiều xử lý admin, nên đọc từ các state và hàm `useEffect` đầu tiên.

---

## 8. Nếu bạn cần mở rộng

Mình có thể:
- Viết thêm comment chi tiết trực tiếp trong từng file.
- Tạo phần giải thích line-by-line cho một file cụ thể.
- Tập trung vào phần backend auth, admin, hoặc UI nào bạn đang cần hơn.
