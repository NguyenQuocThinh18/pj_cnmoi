/*
 * seedCategories.js
 * File mã nguồn: seedCategories.js.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Category = require('./models/Category');

dotenv.config();
connectDB();

const seedCategories = async () => {
  try {
    const categories = [
      // Trong nước
      { name: 'Miền Tây', description: 'Tour du lịch vùng Miền Tây', type: 'Trong nước' },
      { name: 'Miền Nam', description: 'Tour du lịch vùng Miền Nam', type: 'Trong nước' },
      { name: 'Miền Trung', description: 'Tour du lịch vùng Miền Trung', type: 'Trong nước' },
      { name: 'Miền Bắc', description: 'Tour du lịch vùng Miền Bắc', type: 'Trong nước' },
      { name: 'Tây Nguyên', description: 'Tour du lịch vùng Tây Nguyên', type: 'Trong nước' },
      { name: 'Biển Đảo', description: 'Tour biển đảo Việt Nam', type: 'Trong nước' },
      
      // Quốc tế
      { name: 'Châu Á', description: 'Tour du lịch các nước Châu Á', type: 'Quốc tế' },
      { name: 'Châu Âu', description: 'Tour du lịch các nước Châu Âu', type: 'Quốc tế' },
      { name: 'Châu Phi', description: 'Tour du lịch các nước Châu Phi', type: 'Quốc tế' },
      { name: 'Bắc Mỹ', description: 'Tour du lịch Bắc Mỹ', type: 'Quốc tế' },
      { name: 'Nam Mỹ', description: 'Tour du lịch Nam Mỹ', type: 'Quốc tế' },
      { name: 'Châu Đại Dương/Úc', description: 'Tour du lịch Châu Đại Dương và Úc', type: 'Quốc tế' }
    ];

    // Xóa danh mục cũ
    await Category.deleteMany({});

    // Thêm danh mục mới
    const result = await Category.insertMany(categories);
    console.log(`✅ Đã thêm ${result.length} danh mục vào database!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed danh mục:', error);
    process.exit(1);
  }
};

seedCategories();
