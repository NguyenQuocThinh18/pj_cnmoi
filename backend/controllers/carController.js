/*
 * carController.js
 * Quản lý dữ liệu xe cho thuê.
 * Chèn chú thích giải thích mục đích chính của file.
 */

const Car = require('../models/Car');

// 1. [CREATE] Thêm xe mới
exports.createCar = async (req, res) => {
    try {
        const { name, carType, seats, pricePerDay, description, image, features, licensePlate, manufacturer, yearManufactured } = req.body;

        // Validate required fields
        if (!name || !carType || !seats || !pricePerDay) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng cung cấp đầy đủ thông tin: tên xe, loại xe, số ghế, giá' 
            });
        }

        // Check duplicate license plate
        if (licensePlate) {
            const existingCar = await Car.findOne({ licensePlate });
            if (existingCar) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Biển số xe này đã tồn tại!' 
                });
            }
        }

        const newCar = new Car({
            name,
            carType,
            seats,
            pricePerDay,
            description,
            image,
            features: features || [],
            licensePlate,
            manufacturer,
            yearManufactured,
            status: 'available'
        });

        const savedCar = await newCar.save();
        return res.status(201).json({ 
            success: true, 
            message: 'Thêm xe mới thành công!', 
            data: savedCar 
        });
    } catch (error) {
        console.error('❌ [createCar] Lỗi:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi tạo xe mới', 
            error: error.message 
        });
    }
};

// 2. [READ] Lấy danh sách tất cả xe
exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find().sort({ createdAt: -1 });
        return res.status(200).json({ 
            success: true, 
            data: cars 
        });
    } catch (error) {
        console.error('❌ [getAllCars] Lỗi:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi lấy danh sách xe', 
            error: error.message 
        });
    }
};

// 3. [READ] Lấy chi tiết một xe
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy xe' 
            });
        }
        return res.status(200).json({ 
            success: true, 
            data: car 
        });
    } catch (error) {
        console.error('❌ [getCarById] Lỗi:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi lấy chi tiết xe', 
            error: error.message 
        });
    }
};

// 4. [UPDATE] Cập nhật thông tin xe
exports.updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check duplicate license plate
        if (updateData.licensePlate) {
            const existingCar = await Car.findOne({ 
                licensePlate: updateData.licensePlate,
                _id: { $ne: id } // Exclude current car
            });
            if (existingCar) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Biển số xe này đã tồn tại!' 
                });
            }
        }

        const updatedCar = await Car.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!updatedCar) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy xe cần cập nhật' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Cập nhật thông tin xe thành công!', 
            data: updatedCar 
        });
    } catch (error) {
        console.error('❌ [updateCar] Lỗi:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi cập nhật xe', 
            error: error.message 
        });
    }
};

// 5. [DELETE] Xóa xe
exports.deleteCar = async (req, res) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy xe cần xóa' 
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Xóa xe thành công!' 
        });
    } catch (error) {
        console.error('❌ [deleteCar] Lỗi:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi xóa xe', 
            error: error.message 
        });
    }
};

// 6. [UPDATE STATUS] Thay đổi trạng thái xe (available, maintenance, rented)
exports.updateCarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['available', 'maintenance', 'rented'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Trạng thái không hợp lệ' 
            });
        }

        const updatedCar = await Car.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        if (!updatedCar) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tìm thấy xe' 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Cập nhật trạng thái thành công!', 
            data: updatedCar 
        });
    } catch (error) {
        console.error('❌ [updateCarStatus] Lỗi:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi cập nhật trạng thái', 
            error: error.message 
        });
    }
};
