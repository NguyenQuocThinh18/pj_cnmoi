/*
 * NotificationSubscription.js
 * Model lưu thông tin push notification subscription của user
 */

const mongoose = require('mongoose');

const notificationSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
      description: 'ID user nếu đã login, null nếu guest'
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
      description: 'Endpoint của subscription (từ Browser Push API)'
    },
    p256dh: {
      type: String,
      required: true,
      description: 'Public key p256dh'
    },
    auth: {
      type: String,
      required: true,
      description: 'Auth key'
    },
    userAgent: {
      type: String,
      description: 'User agent của thiết bị'
    },
    isActive: {
      type: Boolean,
      default: true,
      description: 'Subscription còn hoạt động hay không'
    }
  },
  { timestamps: true }
);

// Index theo endpoint để tìm kiếm nhanh
notificationSubscriptionSchema.index({ endpoint: 1 });
notificationSubscriptionSchema.index({ userId: 1 });

module.exports = mongoose.model('NotificationSubscription', notificationSubscriptionSchema);
