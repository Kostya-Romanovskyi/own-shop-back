const express = require('express');
const {
	getAllOrders,
	getOrderItems,
	addOrder,
	getUserOrders,
	updateOrderStatus,
	deleteOrder,
} = require('../../controllers/orders');

const router = express.Router();

router.get('/orders', getAllOrders);

router.get('/:userId/orders', getUserOrders);

router.get('/orders/:orderId/items', getOrderItems);

router.post('/order', addOrder);

router.put('/update-status/:orderId', updateOrderStatus);

router.delete('/order/:orderId', deleteOrder);

module.exports = router;
