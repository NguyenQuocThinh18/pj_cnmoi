/*
 * seedVersions.js
 * Seed script để tạo sample app versions cho testing
 * Chạy: node seedVersions.js
 */

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const AppVersion = require('./models/AppVersion');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedVersions = async () => {
  try {
    await connectDB();

    // Xóa versions cũ (optional)
    // await AppVersion.deleteMany({});

    const versions = [
      {
        version: '1.0.0',
        description: 'Initial release - First stable version',
        isRequired: false,
        isCritical: false,
        releaseDate: new Date('2024-06-01')
      },
      {
        version: '1.0.1',
        description: 'Bug fixes and performance improvements',
        isRequired: false,
        isCritical: false,
        releaseDate: new Date('2024-06-15')
      },
      {
        version: '1.1.0',
        description: 'New features: Push notifications, Version check',
        isRequired: false,
        isCritical: false,
        releaseDate: new Date('2024-06-30')
      },
      {
        version: '1.1.1',
        description: 'Security patch - Update recommended',
        isRequired: true,
        isCritical: false,
        releaseDate: new Date('2024-07-10')
      },
      {
        version: '1.2.0',
        description: '🚨 CRITICAL: Security fix - Update required immediately',
        isRequired: true,
        isCritical: true,
        releaseDate: new Date('2024-07-20')
      }
    ];

    // Thêm versions vào database
    for (const version of versions) {
      const exists = await AppVersion.findOne({ version: version.version });
      
      if (!exists) {
        const newVersion = new AppVersion(version);
        await newVersion.save();
        console.log(`✅ Created version: ${version.version}`);
      } else {
        console.log(`⏭️  Version ${version.version} already exists, skipping`);
      }
    }

    console.log('\n✅ Seed versions successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding versions:', error);
    process.exit(1);
  }
};

seedVersions();
