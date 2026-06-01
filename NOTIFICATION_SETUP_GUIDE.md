# 🔔 Hướng dẫn Setup Push Notifications

Tài liệu này hướng dẫn cách cấu hình hệ thống thông báo push cho ứng dụng Du Lịch Việt.

## 🎯 Tính năng

1. **Thông báo tour mới**: Gửi push notification cho tất cả users khi có tour mới
2. **Thông báo cập nhật app**: Hiển thị popup khi có version mới
3. **Real-time notification**: Sử dụng Web Push API + Service Worker

## 🛠️ Cài đặt

### 1. Cài đặt Dependencies

#### Backend
```bash
cd backend
npm install
```

Package `web-push` đã được thêm vào package.json.

#### Frontend
```bash
cd frontend
npm install
```

### 2. Tạo VAPID Keys

VAPID keys được sử dụng để xác thực requests gửi push notifications.

**Chạy lệnh dưới đây ở thư mục backend:**

```bash
npx web-push generate-vapid-keys
```

Output sẽ giống như sau:
```
Public Key: BHn5c9xYeB...
Private Key: AAEajUNzLq...
```

### 3. Cấu hình Environment Variables

**File `.env` trong folder `backend`:**

```env
# Copy các giá trị từ lệnh trên
VAPID_PUBLIC_KEY=BHn5c9xYeB...
VAPID_PRIVATE_KEY=AAEajUNzLq...
VAPID_SUBJECT=mailto:admin@yourdomain.com
```

**Lưu ý:** 
- `VAPID_PUBLIC_KEY` sẽ được frontend sử dụng để subscribe
- `VAPID_PRIVATE_KEY` phải bảo mật (không commit lên git)
- `VAPID_SUBJECT` là email admin của bạn

### 4. Cấu hình Frontend API URL

File `frontend/src/utils/apiConfig.js` phải có đúng API base URL:

```javascript
export const apiConfig = {
  baseUrl: 'http://localhost:5000' // Hoặc URL production của bạn
};
```

## 📝 Cách sử dụng

### Backend

#### 1. API Endpoints

**Lấy VAPID Public Key** (Public)
```
GET /api/notifications/vapid-key
```

**Đăng ký Push Subscription** (Public)
```
POST /api/notifications/subscribe
Body: {
  subscription: {...}, // Từ PushManager.subscribe()
  userAgent: "..."
}
```

**Hủy Subscription** (Public)
```
POST /api/notifications/unsubscribe
Body: {
  endpoint: "..."
}
```

**Kiểm tra phiên bản app** (Public)
```
GET /api/notifications/version-check?currentVersion=1.0.0
```

**Gửi Test Notification** (Admin only)
```
POST /api/notifications/test
Authorization: Bearer {token}
Body: {
  title: "...",
  body: "...",
  icon: "..."
}
```

**Lấy Thống kê** (Admin only)
```
GET /api/notifications/stats
Authorization: Bearer {token}
```

#### 2. Khi tạo tour mới

Tour controller sẽ tự động gửi push notification:
```javascript
// Tự động được gọi trong createTour()
await notificationService.sendNewTourNotification({
  _id: tour._id,
  title: tour.title,
  price: tour.price,
  image: tour.image
});
```

#### 3. Gửi Notification thủ công

```javascript
const notificationService = require('./services/notificationService');

// Gửi notification đến tất cả users
await notificationService.sendNotificationToAll({
  title: 'Tiêu đề',
  body: 'Nội dung',
  icon: '/icon.png',
  data: { url: '/', ... }
});
```

### Frontend

#### 1. Component `NotificationPermission`

Hiển thị button để user subscribe/unsubscribe push notifications.

```javascript
import NotificationPermission from './components/NotificationPermission';

function App() {
  return (
    <>
      <NotificationPermission />
      {/* ... other components */}
    </>
  );
}
```

**Tính năng:**
- Tự động detect browser support
- Hiển thị notification permission prompt
- Lưu subscription lên server
- Button để unsubscribe

#### 2. Component `AppUpdateNotification`

Kiểm tra version app và hiển thị popup cập nhật.

```javascript
import AppUpdateNotification from './components/AppUpdateNotification';

function App() {
  return (
    <>
      <AppUpdateNotification />
      {/* ... other components */}
    </>
  );
}
```

**Tính năng:**
- Kiểm tra version mỗi giờ
- Hiển thị popup nếu có version mới
- Update bắt buộc vs optional
- Support cho web (reload) và mobile (download link)

#### 3. Notification Utils

Sử dụng các utility functions:

```javascript
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  checkAppVersion,
  isPushNotificationSupported
} from './utils/notificationUtils';

// Subscribe
const subscription = await subscribeToPushNotifications();

// Unsubscribe
await unsubscribeFromPushNotifications();

// Kiểm tra version
const versionData = await checkAppVersion('1.0.0');

// Kiểm tra support
const supported = isPushNotificationSupported();
```

## 🧪 Testing

### 1. Test Backend

**Gửi test notification:**
```bash
curl -X POST http://localhost:5000/api/notifications/test \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "body": "This is a test"
  }'
```

**Kiểm tra version:**
```bash
curl "http://localhost:5000/api/notifications/version-check?currentVersion=1.0.0"
```

### 2. Test Frontend

1. Mở app trong browser
2. Bật DevTools (F12)
3. Vào tab "Console"
4. Chạy lệnh:

```javascript
// Subscribe
await subscribeToPushNotifications();

// Kiểm tra version
await checkAppVersion('1.0.0');

// Unsubscribe
await unsubscribeFromPushNotifications();
```

## 📊 Database Models

### NotificationSubscription
```javascript
{
  userId: String (optional),
  endpoint: String (required, unique),
  p256dh: String (required),
  auth: String (required),
  userAgent: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### AppVersion
```javascript
{
  version: String (required, unique),
  releaseDate: Date,
  description: String,
  isRequired: Boolean (default: false),
  isCritical: Boolean (default: false),
  downloadUrl: String (for mobile)
}
```

## 🚀 Deployment

### Backend

1. Đảm bảo `.env` có VAPID keys
2. Database có kết nối tới MongoDB
3. Khởi động server:
   ```bash
   npm start
   ```

### Frontend

1. Build production:
   ```bash
   npm run build
   ```

2. Deploy lên hosting (Vercel, Render, etc.)

3. Update `apiConfig.js` với production API URL

## 🔒 Security

- **VAPID keys**: Bảo mật `VAPID_PRIVATE_KEY`, không commit lên git
- **Endpoints**: Public endpoints không cần auth, admin endpoints cần JWT token
- **Subscriptions**: Tự động xóa subscription nếu endpoint không hợp lệ
- **Data**: Push notification data không bao gồm thông tin nhạy cảm

## 🐛 Troubleshooting

### "Push notifications không được hỗ trợ"
- Kiểm tra trình duyệt (Edge, Chrome, Firefox hỗ trợ)
- Kiểm tra URL (https hoặc localhost)

### "Subscription không được lưu"
- Kiểm tra backend có running không
- Kiểm tra API URL trong frontend
- Xem browser console và server logs

### "Notification không được nhận"
- Kiểm tra VAPID keys có đúng không
- Kiểm tra subscriber có trong database không
- Xem server logs cho error

### "Service Worker không load"
- Kiểm tra file `notification-sw.js` có trong `public/` không
- Xem browser DevTools > Application > Service Workers

## 📚 References

- [Web Push API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web-push Library](https://github.com/web-push-libs/web-push)

## 💡 Tips

1. **Test Push Notifications**: Sử dụng Chrome DevTools > Application > Service Workers > Push để simulate notifications
2. **Monitor Subscriptions**: Sử dụng admin endpoint `/api/notifications/stats` để xem số subscribers
3. **Auto-cleanup**: Subscription tự động bị đánh dấu inactive nếu endpoint không hợp lệ
4. **Version Management**: Tạo AppVersion doc trong admin dashboard để quản lý app versions

---

**Tác giả**: AI Assistant  
**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: June 1, 2026
