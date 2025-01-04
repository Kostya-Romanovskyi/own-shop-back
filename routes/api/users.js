const express = require('express');

const router = express.Router();

const { getUserOrders, getUserById } = require('../../controllers/users');

// router.get('/users/:id')
router.get('/users/:id/orders', getUserOrders);

// Get user by id
router.get('/user/:userId', getUserById);

// /api/orders/:orderId

module.exports = router;
