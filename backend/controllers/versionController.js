/*
 * versionController.js
 * Quản lý phiên bản app
 */

const AppVersion = require('../models/AppVersion');
const notificationService = require('../services/notificationService');

/**
 * Tạo phiên bản app mới
 * POST /api/versions
 */
const createVersion = async (req, res) => {
  try {
    const { version, description, isRequired, isCritical, downloadUrl } = req.body;

    if (!version) {
      return res.status(400).json({
        success: false,
        message: 'Version là bắt buộc'
      });
    }

    // Kiểm tra xem version này đã tồn tại hay chưa
    const existingVersion = await AppVersion.findOne({ version });
    if (existingVersion) {
      return res.status(400).json({
        success: false,
        message: `Version ${version} đã tồn tại`
      });
    }

    const newVersion = new AppVersion({
      version,
      description,
      isRequired: isRequired || false,
      isCritical: isCritical || false,
      downloadUrl
    });

    const savedVersion = await newVersion.save();

    // Gửi notification về app update nếu được cấu hình gửi
    const shouldNotify = req.body.notifyUsers !== false;
    if (shouldNotify) {
      try {
        await notificationService.sendAppUpdateNotification(savedVersion);
      } catch (error) {
        console.error('Lỗi gửi notification update:', error);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Tạo version thành công',
      data: savedVersion
    });
  } catch (error) {
    console.error('Lỗi tạo version:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo version',
      error: error.message
    });
  }
};

/**
 * Lấy danh sách tất cả versions
 * GET /api/versions
 */
const getAllVersions = async (req, res) => {
  try {
    const versions = await AppVersion.find()
      .sort({ version: -1 })
      .lean();

    res.json({
      success: true,
      count: versions.length,
      data: versions
    });
  } catch (error) {
    console.error('Lỗi lấy versions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách versions',
      error: error.message
    });
  }
};

/**
 * Lấy version mới nhất
 * GET /api/versions/latest
 */
const getLatestVersion = async (req, res) => {
  try {
    const latestVersion = await AppVersion.findOne()
      .sort({ version: -1 })
      .lean();

    if (!latestVersion) {
      return res.json({
        success: true,
        message: 'Chưa có version nào',
        data: null
      });
    }

    res.json({
      success: true,
      data: latestVersion
    });
  } catch (error) {
    console.error('Lỗi lấy latest version:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy version mới nhất',
      error: error.message
    });
  }
};

/**
 * Cập nhật version
 * PUT /api/versions/:id
 */
const updateVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, isRequired, isCritical, downloadUrl } = req.body;

    const version = await AppVersion.findByIdAndUpdate(
      id,
      { description, isRequired, isCritical, downloadUrl },
      { new: true }
    );

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version không tìm thấy'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật version thành công',
      data: version
    });
  } catch (error) {
    console.error('Lỗi cập nhật version:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật version',
      error: error.message
    });
  }
};

/**
 * Xóa version
 * DELETE /api/versions/:id
 */
const deleteVersion = async (req, res) => {
  try {
    const { id } = req.params;

    const version = await AppVersion.findByIdAndDelete(id);

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version không tìm thấy'
      });
    }

    res.json({
      success: true,
      message: 'Xóa version thành công',
      data: version
    });
  } catch (error) {
    console.error('Lỗi xóa version:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa version',
      error: error.message
    });
  }
};

/**
 * Gửi notification update app
 * POST /api/versions/:id/notify
 */
const notifyUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const version = await AppVersion.findById(id);

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version không tìm thấy'
      });
    }

    const result = await notificationService.sendAppUpdateNotification(version);

    res.json({
      success: true,
      message: 'Gửi notification thành công',
      data: result
    });
  } catch (error) {
    console.error('Lỗi gửi notification:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi notification',
      error: error.message
    });
  }
};

module.exports = {
  createVersion,
  getAllVersions,
  getLatestVersion,
  updateVersion,
  deleteVersion,
  notifyUpdate
};
