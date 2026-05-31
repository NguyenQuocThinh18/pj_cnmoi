/*
 * categoryController.js
 * Quản lý danh mục tour.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const Category = require('../models/Category');

// Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ type: 1, name: 1 });
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}`,
      domestic: `${baseUrl}/type/domestic`,
      international: `${baseUrl}/type/international`
    };
    
    res.set('Cache-Control', 'public, max-age=3600'); // Cache 1 hour
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh mục', error: error.message });
  }
};

// Lấy danh mục theo loại (Trong nước/Quốc tế)
const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const categories = await Category.find({ type }).sort({ name: 1 });
    
    // HATEOAS links
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const links = {
      self: `${baseUrl}/type/${type}`,
      collection: `${baseUrl.replace(`/type/${type}`, '')}`,
      tours: `${req.protocol}://${req.get('host')}/api/tours?category=${type}`
    };
    
    res.set('Cache-Control', 'public, max-age=3600'); // Cache 1 hour
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      _links: links
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh mục', error: error.message });
  }
};

// Tạo danh mục (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên danh mục!' });
    }
    
    const newCategory = new Category({ name, description, type });
    const savedCategory = await newCategory.save();
    
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công!',
      data: savedCategory
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Danh mục này đã tồn tại!' });
    }
    res.status(500).json({ success: false, message: 'Lỗi khi tạo danh mục', error: error.message });
  }
};

// Cập nhật danh mục (Admin)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type } = req.body;
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, type },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại!' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công!',
      data: updatedCategory
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Danh mục này đã tồn tại!' });
    }
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật danh mục', error: error.message });
  }
};

// Xóa danh mục (Admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại!' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa danh mục', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoriesByType,
  createCategory,
  updateCategory,
  deleteCategory
};
