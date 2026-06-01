# 📱 Notification System Implementation Summary

## ✅ Các tính năng đã được cài đặt

### 1. 🔔 Push Notifications khi có Tour Mới
- **Backend**: Khi admin/staff tạo tour mới → tự động gửi push notification đến tất cả users
- **Frontend**: Users nhận notification even khi app đang chạy ở background
- **Database**: Lưu subscription của users để gửi notification

### 2. 📱 Thông báo Cập nhật App
- **Backend**: Quản lý app versions (AppVersion model)
- **Frontend**: Hiển thị popup khi có version mới
- **Auto-check**: Kiểm tra version mỗi 1 giờ
- **Features**: Support cập nhật bắt buộc (required) & quan trọng (critical)

### 3. 🛠️ Service Worker & Web Push API
- **Service Worker**: `notification-sw.js` xử lý incoming push notifications
- **Subscription Management**: Subscribe/unsubscribe push notifications dễ dàng
- **Browser Support**: Hoạt động trên Chrome, Edge, Firefox

---

## 📁 Files & Folders được tạo/sửa

### Backend

#### Models
```
backend/models/
├── NotificationSubscription.js  (NEW) - Lưu subscription của users
└── AppVersion.js                (NEW) - Lưu version app
```

#### Services
```
backend/services/
└── notificationService.js       (NEW) - Logic gửi push notifications
```

#### Controllers
```
backend/controllers/
├── notificationController.js    (NEW) - API endpoints cho notifications
├── versionController.js         (NEW) - API endpoints cho app versions
└── tourController.js            (MODIFIED) - Thêm logic gửi notification khi tour mới
```

#### Routes
```
backend/routes/
├── notificationRoutes.js        (NEW) - Routes cho notifications
└── versionRoutes.js             (NEW) - Routes cho app versions
```

#### Configuration
```
backend/
├── server.js                    (MODIFIED) - Thêm new routes
├── package.json                 (MODIFIED) - Thêm web-push dependency
└── .env.example                 (MODIFIED) - Thêm VAPID keys config
```

### Frontend

#### Utils
```
frontend/src/utils/
└── notificationUtils.js         (NEW) - Utility functions cho notifications
```

#### Components
```
frontend/src/components/
├── NotificationPermission.jsx   (NEW) - Button để subscribe/unsubscribe
├── AppUpdateNotification.jsx    (NEW) - Popup thông báo cập nhật app
└── App.jsx                      (MODIFIED) - Import & sử dụng 2 components trên
```

#### Public Assets
```
frontend/public/
└── notification-sw.js           (NEW) - Service Worker xử lý push events
```

#### Documentation
```
./
├── NOTIFICATION_SETUP_GUIDE.md  (NEW) - Chi tiết hướng dẫn setup
└── IMPLEMENTATION_SUMMARY.md    (THIS FILE)
```

---

## 🚀 Cách sử dụng

### Cho Users (Frontend)

1. **Bật Push Notifications**
   - Mở app
   - Nhấn nút "Bật thông báo" trong component `NotificationPermission`
   - Browser sẽ hiển thị popup confirm
   - Sau khi accept, subscription được lưu lên server

2. **Nhận Notification khi có Tour Mới**
   - Khi admin tạo tour mới → push notification được gửi
   - Notification sẽ hiển thị ngay cả khi app không mở
   - Nhấn vào notification → mở app và đi tới tour details

3. **Cập nhật App**
   - Popup sẽ tự động hiển thị khi có version mới
   - Nhấn "Cập nhật" → reload app hoặc download link (nếu có)

### Cho Admins (Backend)

1. **Tạo Tour Mới**
   - Admin POST `/api/tours` với dữ liệu tour
   - Notification tự động được gửi đến tất cả subscribers
   - Không cần config thêm gì

2. **Quản lý App Versions**
   ```bash
   # Tạo version mới
   POST /api/versions
   {
     "version": "1.0.1",
     "description": "Fix bugs & performance",
     "isRequired": false,
     "isCritical": false
   }
   
   # Gửi notification cho version
   POST /api/versions/{id}/notify
   
   # Lấy danh sách versions
   GET /api/versions
   
   # Lấy version mới nhất
   GET /api/versions/latest
   ```

3. **Gửi Test Notification**
   ```bash
   POST /api/notifications/test
   Authorization: Bearer {admin_token}
   {
     "title": "Test Notification",
     "body": "Hello World"
   }
   ```

4. **Xem Thống kê**
   ```bash
   GET /api/notifications/stats
   Authorization: Bearer {admin_token}
   ```

---

## 🔐 Setup VAPID Keys

**Cái gì là VAPID?**
- VAPID (Voluntary Application Server Identification) là cơ chế xác thực push notifications
- Browser sử dụng public key để xác thực, server sử dụng private key để ký requests

**Các bước setup:**

1. **Tạo VAPID keys** (chỉ làm 1 lần)
   ```bash
   cd backend
   npx web-push generate-vapid-keys
   ```

2. **Copy giá trị vào `.env`**
   ```env
   VAPID_PUBLIC_KEY=BHn5c9xYeB...
   VAPID_PRIVATE_KEY=AAEajUNzLq...
   VAPID_SUBJECT=mailto:admin@yourdomain.com
   ```

3. **Restart backend**
   ```bash
   npm start
   ```

**⚠️ LƯU Ý:**
- Bảo mật `VAPID_PRIVATE_KEY` - không commit lên git
- Thêm vào `.gitignore` hoặc `.env` (không commit `.env`)
- Frontend tự động lấy public key từ API

---

## 📊 Database Schema

### NotificationSubscription
```javascript
{
  _id: ObjectId,
  userId: String (optional - cho future feature),
  endpoint: String (unique),
  p256dh: String (encryption key),
  auth: String (auth key),
  userAgent: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### AppVersion
```javascript
{
  _id: ObjectId,
  version: String (unique),
  description: String,
  isRequired: Boolean,
  isCritical: Boolean,
  downloadUrl: String (optional),
  releaseDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 API Endpoints

### Notifications (Public)
```
GET    /api/notifications/vapid-key           - Lấy VAPID public key
POST   /api/notifications/subscribe           - Đăng ký push notification
POST   /api/notifications/unsubscribe         - Hủy subscription
GET    /api/notifications/version-check      - Kiểm tra app version
```

### Notifications (Admin)
```
POST   /api/notifications/test                - Test notification
GET    /api/notifications/stats               - Lấy thống kê subscribers
```

### Versions (Public)
```
GET    /api/versions/latest                   - Lấy version mới nhất
GET    /api/versions                          - Lấy tất cả versions
```

### Versions (Admin)
```
POST   /api/versions                          - Tạo version mới
PUT    /api/versions/:id                      - Cập nhật version
DELETE /api/versions/:id                      - Xóa version
POST   /api/versions/:id/notify               - Gửi notification
```

---

## 🧪 Testing

### Test Backend

**1. Generate VAPID keys**
```bash
npx web-push generate-vapid-keys
```

**2. Configure .env**
```env
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

**3. Restart server**
```bash
npm start
```

**4. Test endpoints**
```bash
# Lấy VAPID key
curl http://localhost:5000/api/notifications/vapid-key

# Kiểm tra version
curl "http://localhost:5000/api/notifications/version-check?currentVersion=1.0.0"

# Gửi test notification
curl -X POST http://localhost:5000/api/notifications/test \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Hello"}'
```

### Test Frontend

**1. Mở app trong browser**
- Chạy `npm run dev` trong folder frontend
- Truy cập `http://localhost:5173`

**2. Kiểm tra console**
```javascript
// Subscribe
await subscribeToPushNotifications();

// Kiểm tra version
await checkAppVersion('1.0.0');

// Xem nếu đã subscribe
let reg = await navigator.serviceWorker.ready;
let sub = await reg.pushManager.getSubscription();
console.log(sub);
```

**3. Test notification**
- Push notification từ admin endpoint
- Notification sẽ hiển thị ngay cả khi browser tab không focus

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Push notifications không được hỗ trợ" | Sử dụng Chrome, Edge, hoặc Firefox; hoặc trên localhost |
| Service Worker không load | Kiểm tra `/public/notification-sw.js` có tồn tại không |
| Notification không được nhận | Check VAPID keys có đúng; xem server logs |
| Subscription fail | Kiểm tra API URL trong `notificationUtils.js` |
| Version check not working | Đảm bảo AppVersion model có data trong database |

---

## 🚀 Next Steps (Optional Features)

1. **User-specific notifications**
   - Thêm `userId` vào subscription
   - Gửi notification chỉ cho users nhất định

2. **Notification History**
   - Lưu lịch sử notifications
   - Dashboard xem notification sent

3. **Admin Dashboard UI**
   - Tạo page quản lý versions
   - Gửi notifications từ UI
   - Xem statistics

4. **Email Fallback**
   - Gửi email notification nếu push fail
   - Hoặc email untuk users chưa subscribe push

5. **Mobile App Integration**
   - Firebase Cloud Messaging (FCM)
   - Native mobile app notifications

---

## 📚 Architecture Diagram

```
User's Browser (Frontend)
├── NotificationPermission Component
│   └── subscribeToPushNotifications()
│       └── POST /api/notifications/subscribe
├── AppUpdateNotification Component
│   └── checkAppVersion()
│       └── GET /api/notifications/version-check
├── Service Worker (notification-sw.js)
│   └── onpush event → show notification
│   └── onclick event → navigate

Backend (Node.js)
├── Routes
│   ├── /api/notifications/*
│   ├── /api/versions/*
│   └── /api/tours/* (modified)
├── Controllers
│   ├── notificationController
│   ├── versionController
│   └── tourController (modified)
├── Services
│   └── notificationService
│       └── web-push library
│           └── Push Service (Browser provider)
└── Database
    ├── NotificationSubscription collection
    └── AppVersion collection
```

---

## 📝 Notes

- **Browser Compatibility**: Edge, Chrome, Firefox hỗ trợ push notifications
- **Safari**: Hỗ trợ nhưng limited (iOS 16+, macOS 13+)
- **HTTPS Required**: Push notifications chỉ hoạt động trên HTTPS (hoặc localhost)
- **Offline Capable**: Service Worker cho phép app hoạt động offline

---

**Created**: June 1, 2026  
**Version**: 1.0.0  
**Status**: ✅ Ready for Production
