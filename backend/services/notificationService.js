/*
 * notificationService.js
 * Service xử lý push notification
 */

const webpush = require('web-push');
const NotificationSubscription = require('../models/NotificationSubscription');

// Cấu hình VAPID keys (cần generate từ web-push generate-vapid-keys)
// Bạn cần thêm vào .env:
// VAPID_PUBLIC_KEY=...
// VAPID_PRIVATE_KEY=...
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:example@example.com';

// Thiết lập VAPID details
if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

/**
 * Lưu subscription của user
 */
const saveSubscription = async (subscription) => {
  try {
    // Kiểm tra xem subscription này đã tồn tại hay chưa
    const existingSubscription = await NotificationSubscription.findOne({
      endpoint: subscription.endpoint
    });

    if (existingSubscription) {
      // Cập nhật nếu đã tồn tại
      existingSubscription.isActive = true;
      await existingSubscription.save();
      return existingSubscription;
    }

    // Tạo mới nếu chưa tồn tại
    const newSubscription = new NotificationSubscription({
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent: subscription.userAgent || 'unknown'
    });

    await newSubscription.save();
    return newSubscription;
  } catch (error) {
    console.error('Lỗi khi lưu subscription:', error);
    throw error;
  }
};

/**
 * Gửi push notification đến một subscription
 */
const sendNotificationToSubscription = async (subscription, payload) => {
  try {
    const subscriptionObject = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    };

    await webpush.sendNotification(subscriptionObject, JSON.stringify(payload));
    return true;
  } catch (error) {
    // Nếu subscription không còn hợp lệ, xóa nó
    if (error.statusCode === 410 || error.statusCode === 404) {
      await NotificationSubscription.updateOne(
        { endpoint: subscription.endpoint },
        { isActive: false }
      );
      console.error('Subscription không còn hợp lệ, đã tắt isActive:', subscription.endpoint);
    }
    console.error('Lỗi khi gửi notification tới endpoint:', subscription.endpoint, error.statusCode, error.message);
    return false;
  }
};

/**
 * Gửi push notification đến tất cả subscribers
 */
const sendNotificationToAll = async (payload) => {
  try {
    const subscriptions = await NotificationSubscription.find({
      isActive: true
    });

    if (subscriptions.length === 0) {
      console.log('Không có subscribers để gửi notification');
      return { sent: 0, failed: 0 };
    }

    let successCount = 0;
    let failureCount = 0;

    // Gửi notification đến tất cả subscribers (song song)
    const promises = subscriptions.map(async (subscription) => {
      const success = await sendNotificationToSubscription(subscription, payload);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    });

    await Promise.all(promises);

    console.log(`Notification gửi thành công: ${successCount}, thất bại: ${failureCount}`);
    return { sent: successCount, failed: failureCount };
  } catch (error) {
    console.error('Lỗi khi gửi notification đến tất cả:', error);
    throw error;
  }
};

/**
 * Gửi notification khi có tour mới
 */
const isDataUrl = (value) => typeof value === 'string' && /^data:/i.test(value);
const getSafeNotificationImage = (image) => {
  if (!image || isDataUrl(image)) {
    return '/assets/img/icon/favicon.png';
  }
  return image;
};

const sendNewTourNotification = async (tourData) => {
  const safeImage = getSafeNotificationImage(tourData.image);

  const payload = {
    title: '🎉 Có tour mới!',
    body: `${tourData.title} - Giá: ${Number(tourData.price).toLocaleString('vi-VN')}₫`,
    icon: '/assets/img/icon/favicon.png',
    image: safeImage,
    badge: '/assets/img/icon/favicon.png',
    tag: `tour-${tourData._id}`,
    data: {
      tourId: tourData._id,
      url: `/tours/id/${tourData._id}`,
      timestamp: new Date().toISOString()
    }
  };

  return await sendNotificationToAll(payload);
};

/**
 * Gửi notification cập nhật app
 */
const sendAppUpdateNotification = async (versionData) => {
  const payload = {
    title: '📱 Có phiên bản mới!',
    body: `Ứng dụng cần cập nhật. ${versionData.description || ''}`,
    icon: '/assets/img/icon/favicon.png',
    badge: '/assets/img/icon/favicon.png',
    tag: 'app-update',
    data: {
      version: versionData.version,
      isRequired: versionData.isRequired,
      url: '/',
      timestamp: new Date().toISOString()
    }
  };

  return await sendNotificationToAll(payload);
};

/**
 * Xóa subscription khi user unsubscribe
 */
const removeSubscription = async (endpoint) => {
  try {
    await NotificationSubscription.updateOne(
      { endpoint },
      { isActive: false }
    );
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa subscription:', error);
    return false;
  }
};

/**
 * Lấy số lượng active subscribers
 */
const getActiveSubscriberCount = async () => {
  try {
    const count = await NotificationSubscription.countDocuments({
      isActive: true
    });
    return count;
  } catch (error) {
    console.error('Lỗi khi lấy số lượng subscribers:', error);
    return 0;
  }
};

module.exports = {
  saveSubscription,
  sendNotificationToSubscription,
  sendNotificationToAll,
  sendNewTourNotification,
  sendAppUpdateNotification,
  removeSubscription,
  getActiveSubscriberCount
};
