/*
 * AppVersion.js
 * Model quản lý version của app để kiểm tra cập nhật
 */

const mongoose = require('mongoose');

const appVersionSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: true,
      unique: true,
      description: 'Version app (vd: 1.0.0)'
    },
    releaseDate: {
      type: Date,
      default: Date.now,
      description: 'Ngày phát hành version'
    },
    description: {
      type: String,
      description: 'Mô tả nội dung update'
    },
    isRequired: {
      type: Boolean,
      default: false,
      description: 'Cập nhật bắt buộc hay không'
    },
    isCritical: {
      type: Boolean,
      default: false,
      description: 'Cập nhật quan trọng hay không'
    },
    downloadUrl: {
      type: String,
      description: 'Link download (nếu có app mobile)'
    }
  },
  { timestamps: true }
);

// Index theo version để tìm kiếm nhanh
appVersionSchema.index({ version: -1 });

module.exports = mongoose.model('AppVersion', appVersionSchema);
