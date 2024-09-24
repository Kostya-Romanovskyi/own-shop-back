const express = require('express')
const {
	getUserCart,
	addItemInCart,
	calcTotalPrice,
	deleteItemFromCart,
	updateItemInCart,
} = require('../../controllers/cart')

const router = express.Router()

router.get('/:userId/cart', getUserCart)

router.post('/cart', addItemInCart)

router.get('/:userId/calc-totalPrice', calcTotalPrice)

router.patch('/:cartId/cart-item-update', updateItemInCart)

router.delete('/:cartItemId/delete-cart', deleteItemFromCart)

module.exports = router
