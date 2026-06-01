/* 
 * notification-sw.js
 * Service Worker handler cho Push Notifications
 * File này sẽ được register bởi main notification handler
 */

// Event khi nhận được push notification
self.addEventListener('push', (event) => {
  console.log('🔔 Push event nhận được:', event);

  if (!event.data) {
    console.log('⚠️ Push notification không có data');
    return;
  }

  try {
    const payload = event.data.json();
    console.log('📦 Payload từ server:', payload);
    
    const options = {
      body: payload.body,
      icon: payload.icon || '/assets/img/icon/favicon.png',
      badge: payload.badge || '/assets/img/icon/favicon.png',
      tag: payload.tag || 'notification',
      data: payload.data || {},
      requireInteraction: payload.data?.isRequired || false,
      actions: [
        {
          action: 'open',
          title: 'Xem chi tiết'
        },
        {
          action: 'close',
          title: 'Đóng'
        }
      ]
    };

    console.log('📢 Gọi showNotification với:', { title: payload.title, options });
    event.waitUntil(
      self.registration.showNotification(payload.title, options)
        .then(() => console.log('✅ showNotification thành công'))
        .catch(err => console.error('❌ showNotification thất bại:', err))
    );
  } catch (error) {
    console.error('❌ Lỗi xử lý push notification:', error);
  }
});

// Event khi user click vào notification
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notification clicked:', event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  if (event.action === 'close') {
    return;
  }

  // Tìm kiếm window đã mở với URL đó
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // Nếu đã mở, focus vào window đó
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Nếu chưa mở, mở tab mới
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Event khi user close notification
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notification closed:', event);
});
