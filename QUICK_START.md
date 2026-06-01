# 🚀 Quick Start Guide - Push Notifications

Hướng dẫn nhanh để setup và test push notifications trong 5 phút.

## 📋 Prerequisites

- Node.js v14+
- MongoDB (cloud hoặc local)
- Trình duyệt hỗ trợ Push API (Chrome, Edge, Firefox)

## ⚡ 5-Minute Setup

### Step 1: Backend Setup

```bash
cd backend
npm install
```

### Step 2: Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

Sao chép output:
```
Public Key: BHn5c9xYeB...
Private Key: AAEajUNzLq...
```

### Step 3: Configure .env

Mở `backend/.env` và thêm (hoặc update):

```env
VAPID_PUBLIC_KEY=BHn5c9xYeB...
VAPID_PRIVATE_KEY=AAEajUNzLq...
VAPID_SUBJECT=mailto:admin@yourdomain.com
```

### Step 4: Seed Test Versions (Optional)

```bash
node seedVersions.js
```

### Step 5: Start Backend

```bash
npm start
# Hoặc dev mode:
npm run dev
```

### Step 6: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Mở `http://localhost:5173` trong browser

### Step 7: Test Notifications

1. **Mở app** → Bạn sẽ thấy 2 components ở đầu trang
2. **Bật thông báo** → Nhấn "Bật thông báo" button
3. **Browser sẽ hỏi** → Click "Allow" để cho phép notifications
4. **Subscription được lưu** → Bạn sẽ thấy message "Đặng ký thành công"

## 🧪 Testing Scenarios

### Test 1: Notification khi tạo Tour Mới

1. Login admin
2. Vào Admin Dashboard
3. Tạo tour mới
4. **➜ Notification sẽ hiển thị** (nếu browser tab không focus)

### Test 2: Gửi Test Notification

Sử dụng curl hoặc Postman:

```bash
curl -X POST http://localhost:5000/api/notifications/test \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🎉 Test Notification",
    "body": "Notification system is working!"
  }'
```

**Lưu ý:** Thay `{admin_token}` bằng JWT token của admin user

### Test 3: Version Check

```bash
curl "http://localhost:5000/api/notifications/version-check?currentVersion=1.0.0"
```

Response:
```json
{
  "success": true,
  "updateAvailable": true,
  "currentVersion": "1.0.0",
  "latestVersion": "1.2.0",
  "description": "New features and bug fixes",
  "isRequired": false
}
```

## 🔍 Debugging

### Service Worker không load?

Mở DevTools (F12) → Application → Service Workers

Nên thấy:
```
✓ notification-sw.js
```

### Subscription không được lưu?

1. Mở DevTools Console
2. Chạy:
   ```javascript
   let reg = await navigator.serviceWorker.ready;
   let sub = await reg.pushManager.getSubscription();
   console.log(sub);
   ```
3. Nếu `null` → chưa subscribe
4. Kiểm tra browser console có error không

### Notification không được nhận?

1. Kiểm tra VAPID keys có đúng không
2. Check backend logs
3. Kiểm tra database có subscription không:
   ```bash
   # Trong MongoDB
   db.notificationsubscriptions.find()
   ```

## 🎯 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot GET /notification-sw.js" | Kiểm tra file `/public/notification-sw.js` có tồn tại |
| "VAPID keys invalid" | Generate mới: `npx web-push generate-vapid-keys` |
| Notification không hiển thị | Kiểm tra DevTools Application tab |
| "Browser không hỗ trợ" | Sử dụng Chrome, Edge hoặc Firefox |

## 📱 Testing on Different Browsers

### Chrome
```
✅ Hỗ trợ đầy đủ
✅ Test trên desktop & Android
```

### Firefox
```
✅ Hỗ trợ đầy đủ
⚠️ Cần enable dom.serviceWorkers.enabled
```

### Edge
```
✅ Hỗ trợ đầy đủ (Chromium-based)
```

### Safari
```
❌ macOS < 13: Không hỗ trợ
✅ macOS 13+, iOS 16+: Hỗ trợ giới hạn
```

## 🎓 Next Steps

1. **Đọc full documentation**: [NOTIFICATION_SETUP_GUIDE.md](./NOTIFICATION_SETUP_GUIDE.md)
2. **Xem implementation details**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
3. **Integrate vào your app**: Thêm components vào pages bạn muốn

## 💡 Pro Tips

1. **Disable notification sound**: 
   - DevTools > Settings > Notifications > Disable sound

2. **Simulate push event**:
   - DevTools > Application > Service Workers > Push (button)

3. **Test offline notifications**:
   - DevTools > Network > offline
   - Thử subscribe hoặc gửi notification
   - Service Worker sẽ cache

4. **Monitor subscribers**:
   ```bash
   curl http://localhost:5000/api/notifications/stats \
     -H "Authorization: Bearer {admin_token}"
   ```

## 🆘 Getting Help

1. Check browser console (F12 → Console)
2. Check server logs (terminal nơi chạy `npm start`)
3. Enable debug logging:
   ```javascript
   // Trong notificationUtils.js
   console.log('[DEBUG]', ...);
   ```

## 📚 Resources

- [Web Push API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web-push Library](https://github.com/web-push-libs/web-push)

---

**Bạn đã sẵn sàng để sử dụng Push Notifications! 🎉**

Nếu gặp vấn đề, check các file documentation hoặc debug bằng browser DevTools.
