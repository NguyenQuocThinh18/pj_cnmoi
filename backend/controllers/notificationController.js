/*
 * notificationController.js
 * Controller xử lý push notification endpoints
 */

const notificationService = require('../services/notificationService');
const AppVersion = require('../models/AppVersion');

/**
 * Lưu push subscription từ client
 * POST /api/notifications/subscribe
 */
const subscribe = async (req, res) => {
  try {
    const { subscription, userAgent } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Subscription không hợp lệ'
      });
    }

    // Lưu subscription vào database
    const savedSubscription = await notificationService.saveSubscription({
      ...subscription,
      userAgent
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký nhận thông báo thành công',
      data: savedSubscription
    });
  } catch (error) {
    console.error('Lỗi subscribe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đăng ký nhận thông báo',
      error: error.message
    });
  }
};

/**
 * Hủy push subscription
 * POST /api/notifications/unsubscribe
 */
const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint không hợp lệ'
      });
    }

    await notificationService.removeSubscription(endpoint);

    res.json({
      success: true,
      message: 'Hủy đăng ký thành công'
    });
  } catch (error) {
    console.error('Lỗi unsubscribe:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy đăng ký',
      error: error.message
    });
  }
};

/**
 * Lấy VAPID public key cho client
 * GET /api/notifications/vapid-key
 */
const getVapidKey = async (req, res) => {
  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      return res.status(500).json({
        success: false,
        message: 'VAPID key chưa được cấu hình'
      });
    }

    res.json({
      success: true,
      vapidPublicKey
    });
  } catch (error) {
    console.error('Lỗi get VAPID key:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy VAPID key',
      error: error.message
    });
  }
};

/**
 * Gửi test notification
 * POST /api/notifications/test
 * (Dùng cho admin để test)
 */
const sendTestNotification = async (req, res) => {
  try {
    const { title, body, icon } = req.body;

    const payload = {
      title: title || '🎉 Test Notification',
      body: body || 'Đây là thông báo test từ hệ thống',
      icon: icon || '/assets/img/icon/favicon.png',
      badge: '/assets/img/icon/favicon.png',
      tag: 'test-notification',
      data: {
        url: '/',
        timestamp: new Date().toISOString()
      }
    };

    const result = await notificationService.sendNotificationToAll(payload);

    res.json({
      success: true,
      message: 'Gửi test notification thành công',
      data: result
    });
  } catch (error) {
    console.error('Lỗi send test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi test notification',
      error: error.message
    });
  }
};

/**
 * Kiểm tra phiên bản app và cấp nhật
 * GET /api/notifications/version-check?currentVersion=1.0.0
 */
const checkAppVersion = async (req, res) => {
  try {
    const { currentVersion } = req.query;

    // Lấy phiên bản mới nhất từ database
    const latestVersion = await AppVersion.findOne()
      .sort({ version: -1 })
      .lean();

    if (!latestVersion) {
      return res.json({
        success: true,
        updateAvailable: false,
        message: 'Bạn đang sử dụng phiên bản mới nhất'
      });
    }

    const needsUpdate = currentVersion !== latestVersion.version;

    res.json({
      success: true,
      updateAvailable: needsUpdate,
      currentVersion,
      latestVersion: latestVersion.version,
      description: latestVersion.description,
      isRequired: latestVersion.isRequired,
      isCritical: latestVersion.isCritical,
      downloadUrl: latestVersion.downloadUrl,
      releaseDate: latestVersion.releaseDate
    });
  } catch (error) {
    console.error('Lỗi check version:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra phiên bản',
      error: error.message
    });
  }
};

/**
 * Lấy số lượng active subscribers
 * GET /api/notifications/stats
 */
const getStats = async (req, res) => {
  try {
    const activeSubscribers = await notificationService.getActiveSubscriberCount();

    res.json({
      success: true,
      data: {
        activeSubscribers
      }
    });
  } catch (error) {
    console.error('Lỗi get stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê',
      error: error.message
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getVapidKey,
  sendTestNotification,
  checkAppVersion,
  getStats
};
