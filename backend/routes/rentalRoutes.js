const express = require('express');
const router = express.Router();
const { verifyAdminOrStaff } = require('../middleware/verifyToken');
const { createRental, getAllRentals, updateRentalStatus, deleteRental } = require('../controllers/rentalController');

router.post('/', createRental); // Khách ngoài trang chủ dùng
router.get('/', verifyAdminOrStaff, getAllRentals); // Chỉ nhân viên/admin
router.put('/:id', verifyAdminOrStaff, updateRentalStatus);
router.delete('/:id', verifyAdminOrStaff, deleteRental);

module.exports = router;