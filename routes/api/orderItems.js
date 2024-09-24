const express = require('express')

const router = express.Router()

const { addOrderItem } = require('../../controllers/orderItems')

// add order item
router.post('/order_item', addOrderItem)

module.exports = router
