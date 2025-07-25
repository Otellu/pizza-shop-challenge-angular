const express = require('express');
const admin = require('../middleware/admin.js');
const { getAllOrders, updateOrderStatus, confirmOrder } = require('../controllers/adminController.js');

const router = express.Router();

router.get('/orders', admin, getAllOrders);
router.patch('/orders/:orderId/status', admin, updateOrderStatus);
router.patch('/orders/:orderId/confirm', admin, confirmOrder);

module.exports = router;
