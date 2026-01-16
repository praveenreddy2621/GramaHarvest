const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderStatus, updateOrderTracking, getDashboardStats, getOrderById } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.route('/:id').get(protect, admin, getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/tracking').put(protect, admin, updateOrderTracking);

module.exports = router;
