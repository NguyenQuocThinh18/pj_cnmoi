# 🌍 Website Quản Lý Đặt Tour Du Lịch - Du Lịch Việt
## 📘 Tài liệu mã nguồn
* Đã bổ sung CODE_NOTES.md giải thích chi tiết chức năng từng file.


Dự án Đồ án môn học / Khóa luận tốt nghiệp xây dựng hệ thống quản lý và đặt tour du lịch trực tuyến sử dụng mô hình **MERN Stack** (MongoDB, Express, ReactJS, NodeJS).

## 🚀 Tính năng chính

### 👤 Dành cho Khách hàng (User)
* **Khám phá Tour:** Xem danh sách tour trong nước/quốc tế, lọc và tìm kiếm thông tin chi tiết.
* **Đặt Tour (Booking):** Đặt tour trực tuyến, chọn số lượng khách và tính tổng tiền tự động.
* **Thanh toán:** Tích hợp quy trình thanh toán giả lập (Sandbox) an toàn.
* **Blog & Cẩm nang:** Đọc bài viết chia sẻ kinh nghiệm và thảo luận.
* **Đánh giá & Bình luận:** Chấm điểm 5 sao cho Tour và để lại bình luận tương tác tại các bài viết.
* **Quản lý cá nhân:** Theo dõi lịch sử đơn hàng và cập nhật thông tin tài khoản.

### 👨‍💼 Dành cho Quản trị viên (Admin)
* **Dashboard:** Thống kê tổng quan về doanh thu, số lượng khách hàng và tour phổ biến.
* **Quản lý Tour:** Toàn quyền Thêm, Sửa, Xóa (CRUD) các gói tour du lịch.
* **Quản lý Blog:** Biên tập và đăng tải nội dung cẩm nang du lịch.
* **Duyệt Đơn hàng:** Quản lý trạng thái thanh toán và thông tin khách đặt tour.
* **Quản trị Thành viên:** Theo dõi danh sách người dùng trên hệ thống.
* **Kiểm duyệt Bình luận:** Quản lý và xóa các phản hồi không phù hợp.

## 🛠 Công nghệ sử dụng

* **Frontend:** React.js (Vite), Tailwind CSS, Bootstrap 5, Axios, React Router Dom.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB & Mongoose (ODM).
* **Xác thực:** JSON Web Token (JWT) & Bcrypt.js.
* **Công cụ khác:** Dotenv, CORS, PlantUML (vẽ sơ đồ hệ thống).

## 🔧 Cập nhật mới
* Đã ẩn nút Chat với AI trong widget chat để chỉ giữ lại tùy chọn Chat với Nhân viên.
* Trang ForgotPassword hiện chạy chế độ giả lập khôi phục mật khẩu khi backend/email chưa sẵn sàng.
* Khi người dùng nhấn GỬI YÊU CẦU, hệ thống sẽ hiển thị phản hồi thành công giả lập ngay lập tức.

## Sơ đồ Use Case tổng quát
<img width="1042" height="604" alt="image" src="https://github.com/user-attachments/assets/50eeed75-ea15-4b55-aa8a-2df20589a588" />

## 📦 Cấu trúc thư mục

```text
quan-ly-du-lich/
├── backend/            # Mã nguồn phía máy chủ
│   ├── config/         # Kết nối Database
│   ├── controllers/    # Xử lý logic nghiệp vụ
│   ├── models/         # Định nghĩa cấu trúc dữ liệu (Schema)
│   ├── routes/         # Định nghĩa các đường dẫn API
│   └── server.js       # Điểm khởi đầu của server
├── frontend/           # Mã nguồn phía giao diện người dùng
│   ├── public/         # Tài nguyên tĩnh (Ảnh, Icon)
│   ├── src/
│   │   ├── components/ # Các thành phần giao diện dùng chung
│   │   └── pages/      # Các trang chính của ứng dụng
│   └── App.jsx         # Cấu hình Route chính
└── README.md
