const express = require('express')

const router = express.Router()

const { getUserOrders } = require('../../controllers/users')

// router.get('/users/:id')
router.get('/users/:id/orders', getUserOrders)

// /api/orders/:orderId

module.exports = router
