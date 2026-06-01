/* 
 * notification-sw.js
 * Service Worker handler cho Push Notifications
 * File này sẽ được register bởi main notification handler
 */

// Event khi nhận được push notification
self.addEventListener('push', (event) => {
  console.log('Push notification nhận được:', event);

  if (!event.data) {
    console.log('Push notification không có data');
    return;
  }

  try {
    const payload = event.data.json();
    const options = {
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/badge-72x72.png',
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

    event.waitUntil(
      self.registration.showNotification(payload.title, options)
    );
  } catch (error) {
    console.error('Lỗi xử lý push notification:', error);
  }
});

// Event khi user click vào notification
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

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
  console.log('Notification closed:', event);
});
