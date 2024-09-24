const express = require('express')
const { getAllOrders, getOrderItems, addOrder, getUserOrders } = require('../../controllers/orders')

const router = express.Router()

router.get('/orders', getAllOrders)

router.get('/:userId/orders', getUserOrders)

router.get('/orders/:orderId/items', getOrderItems)

router.post('/order', addOrder)

module.exports = router
