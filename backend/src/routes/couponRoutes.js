const express = require('express');
const router = express.Router();
const {
    validateCoupon,
    getAllCoupons,
    getPublicCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    useCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public/User routes
router.get('/public', getPublicCoupons);
router.post('/validate', protect, validateCoupon);
router.post('/:id/use', protect, useCoupon);

// Admin routes
router.route('/')
    .get(protect, admin, getAllCoupons)
    .post(protect, admin, createCoupon);

router.route('/:id')
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deleteCoupon);

module.exports = router;
