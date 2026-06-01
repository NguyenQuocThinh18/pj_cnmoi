/*
 * NotificationPermission.jsx
 * Component yêu cầu user cho phép nhận thông báo
 */

import React, { useState, useEffect } from 'react';
import {
  isPushNotificationSupported,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  registerServiceWorker
} from '../utils/notificationUtils';
import Swal from 'sweetalert2';

const NotificationPermission = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra push notification support khi component mount
  useEffect(() => {
    const checkSupport = () => {
      const supported = isPushNotificationSupported();
      setIsSupported(supported);

      if (supported) {
        // Đăng ký service worker
        registerServiceWorker().catch(error => {
          console.error('Lỗi đăng ký service worker:', error);
        });

        // Kiểm tra xem đã subscribe chưa
        checkSubscriptionStatus();
      }
    };

    checkSupport();
  }, []);

  // Kiểm tra status subscription
  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Lỗi kiểm tra subscription:', error);
    }
  };

  // Xử lý subscribe
  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const subscription = await subscribeToPushNotifications();

      if (subscription) {
        setIsSubscribed(true);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn sẽ nhận được thông báo về tour mới',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể đăng ký nhận thông báo'
        });
      }
    } catch (error) {
      console.error('Lỗi:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Có lỗi xảy ra: ' + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý unsubscribe
  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const result = await unsubscribeFromPushNotifications();

      if (result) {
        setIsSubscribed(false);
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Bạn đã hủy đăng ký nhận thông báo',
          timer: 3000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Lỗi:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Có lỗi xảy ra'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null; // Không hiển thị nếu trình duyệt không hỗ trợ
  }

  return (
    <div style={{
      padding: '12px 16px',
      backgroundColor: isSubscribed ? '#d4edda' : '#fff3cd',
      borderRadius: '6px',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: `1px solid ${isSubscribed ? '#c3e6cb' : '#ffc107'}`
    }}>
      <span style={{ fontSize: '14px', color: '#333' }}>
        {isSubscribed 
          ? '🔔 Bạn đã bật thông báo tour mới'
          : '🔕 Bật thông báo để nhận được tour mới ngay'
        }
      </span>
      <button
        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
        disabled={isLoading}
        style={{
          padding: '6px 12px',
          backgroundColor: isSubscribed ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {isLoading
          ? 'Đang xử lý...'
          : (isSubscribed ? 'Tắt thông báo' : 'Bật thông báo')
        }
      </button>
    </div>
  );
};

export default NotificationPermission;
