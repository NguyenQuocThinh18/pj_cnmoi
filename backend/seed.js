/*
 * seed.js
 * File mã nguồn: seed.js.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Xóa tất cả user cũ
    await User.deleteMany({});
    console.log('🗑️ Deleted all users');

    // Tạo user khách hàng
    const customerUser = {
      name: 'Nguyễn Văn A',
      email: 'user@gmail.com',
      password: 'User123456!',
      phone: '0123456789',
      role: 'user'
    };

    const newCustomer = await User.create(customerUser);
    console.log('✅ Customer user created:', newCustomer);

    // Tạo staff (nhân viên)
    const staffUser = {
      name: 'Lê Thị B',
      email: 'staff@gmail.com',
      password: 'Staff123456!',
      phone: '0987654321',
      role: 'staff'
    };

    const newStaff = await User.create(staffUser);
    console.log('✅ Staff user created:', newStaff);

    // Tạo admin user
    const adminUser = {
      name: 'Admin System',
      email: 'admin@gmail.com',
      password: 'Admin123456!',
      phone: '0912345678',
      role: 'admin'
    };

    const newAdmin = await User.create(adminUser);
    console.log('✅ Admin user created:', newAdmin);

    mongoose.connection.close();
    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
