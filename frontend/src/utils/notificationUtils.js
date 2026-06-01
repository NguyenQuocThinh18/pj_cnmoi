/*
 * notificationUtils.js
 * Utility cho push notification management ở frontend
 */

import { apiConfig } from './apiConfig';

const API_BASE_URL = apiConfig.baseUrl || 'http://localhost:5000';

/**
 * Kiểm tra xem trình duyệt có hỗ trợ push notifications hay không
 */
export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Đăng ký service worker cho push notifications
 */
export const registerServiceWorker = async () => {
  if (!isPushNotificationSupported()) {
    console.log('Push notifications không được hỗ trợ');
    return null;
  }

  try {
    const existingRegistration = await navigator.serviceWorker.getRegistration();
    if (existingRegistration) {
      console.log('Sử dụng Service Worker hiện có:', existingRegistration);
      try {
        await existingRegistration.update();
        console.log('Service Worker đã được cập nhật');
      } catch (updateError) {
        console.warn('Không thể cập nhật service worker hiện có:', updateError);
      }
      await navigator.serviceWorker.ready;
      return existingRegistration;
    }

    const swUrl = new URL('/sw.js', window.location.origin).toString();

    // Đăng ký service worker chính của PWA
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/'
    });

    await navigator.serviceWorker.ready;
    console.log('Service Worker đã được đăng ký:', registration);
    return registration;
  } catch (error) {
    console.error('Lỗi đăng ký Service Worker:', error);
    return null;
  }
};

/**
 * Lấy VAPID public key từ server
 */
export const getVapidPublicKey = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/vapid-key`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.vapidPublicKey;
  } catch (error) {
    console.error('Lỗi lấy VAPID key:', error);
    return null;
  }
};

/**
 * Convert base64 string thành Uint8Array
 */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

/**
 * Đăng ký push notification subscription
 */
export const subscribeToPushNotifications = async () => {
  if (!isPushNotificationSupported()) {
    console.log('Push notifications không được hỗ trợ');
    return null;
  }

  if ('Notification' in window && Notification.permission === 'denied') {
    throw new Error('Bạn đã chặn thông báo. Vui lòng bật lại trong cài đặt trình duyệt.');
  }

  try {
    if ('Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Bạn cần cho phép thông báo để đăng ký.');
      }
    }

    const registration = await registerServiceWorker();
    if (!registration) {
      throw new Error('Không thể đăng ký service worker. Vui lòng thử lại sau.');
    }

    const vapidPublicKey = await getVapidPublicKey();
    if (!vapidPublicKey) {
      throw new Error('Không thể lấy VAPID key');
    }

    // Kiểm tra xem đã subscribe chưa
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Đã subscribe push notifications rồi');
      return existingSubscription;
    }

    // Subscribe mới
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    // Gửi subscription lên server
    const saved = await savePushSubscription(subscription);
    if (!saved || !saved.success) {
      throw new Error('Không thể lưu thông tin đăng ký lên server');
    }

    console.log('Push notification subscription thành công');
    return subscription;
  } catch (error) {
    console.error('Lỗi subscribe push notifications:', error);
    throw error;
  }
};

/**
 * Gửi push subscription lên server
 */
export const savePushSubscription = async (subscription) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    console.log('Push subscription đã được lưu');
    return data;
  } catch (error) {
    console.error('Lỗi lưu push subscription:', error);
    return null;
  }
};

/**
 * Hủy push notification subscription
 */
export const unsubscribeFromPushNotifications = async () => {
  if (!isPushNotificationSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('Chưa có push subscription');
      return true;
    }

    // Hủy subscription ở server
    await fetch(`${API_BASE_URL}/api/notifications/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      })
    });

    // Unsubscribe từ push manager
    const unsubscribed = await subscription.unsubscribe();

    if (unsubscribed) {
      console.log('Hủy push notification subscription thành công');
    }

    return unsubscribed;
  } catch (error) {
    console.error('Lỗi hủy push notification subscription:', error);
    return false;
  }
};

/**
 * Kiểm tra phiên bản app
 */
export const checkAppVersion = async (currentVersion) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/version-check?currentVersion=${currentVersion}`
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Lỗi kiểm tra phiên bản:', error);
    return null;
  }
};

/**
 * Lấy thống kê subscribers (chỉ admin)
 */
export const getNotificationStats = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    console.error('Lỗi lấy thống kê:', error);
    return null;
  }
};

export default {
  isPushNotificationSupported,
  registerServiceWorker,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  checkAppVersion,
  getNotificationStats
};
