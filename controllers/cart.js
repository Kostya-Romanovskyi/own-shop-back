const { Cart, cartScheme } = require('../models/cart')
const { ProductsItem } = require('../models/productsItem')

const getUserCart = async (req, res) => {
	const { userId } = req.params

	try {
		const result = await Cart.findAll({
			where: { users_id: userId, cart_status: 'active' },
			include: [
				{
					model: ProductsItem,
				},
			],
		})

		const calcTotalPrice = result.reduce((acc, item) => {
			return acc + +item.price
		}, 0)

		const totalPrice = calcTotalPrice.toFixed(2)

		res.status(200).json({ result, totalPrice: +totalPrice })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const addItemInCart = async (req, res) => {
	try {
		const { users_id, products_item_id, quantity, unit_price } = req.body

		const productPrice = await ProductsItem.findOne({ where: products_item_id })
		const finalPrice = quantity * +productPrice.price

		const result = await Cart.create({
			users_id,
			products_item_id,
			quantity,
			price: +finalPrice.toFixed(2),
			cart_status: 'active',
			unit_price,
		})

		res.status(201).json(result)
	} catch (error) {
		console.error('Error adding item to cart:', error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
}

const calcTotalPrice = async (req, res) => {
	try {
		const { userId } = req.params
		const cartItems = await Cart.findAll({ where: { users_id: userId } })

		const totalPrice = cartItems.reduce((acc, item) => {
			console.log(item.price)
			return acc + item.price
		}, 0)

		res.status(200).json(totalPrice)
	} catch (error) {
		res.status(500).json({ error: 'Error in calc total price' })
	}
}

const updateItemInCart = async (req, res) => {
	try {
		const { cartId } = req.params
		const { products_item_id, quantity } = req.body

		const item = await ProductsItem.findOne({ where: { id: products_item_id } })

		const updatedPrice = +quantity * item.price

		const updatedItemInCart = {
			quantity,
			price: updatedPrice.toFixed(2),
		}

		await Cart.update(updatedItemInCart, { where: { cart_id: cartId } })
		res.status(200).json({ message: 'Item successfully was updated' })
	} catch (error) {
		res.status(500).json({ error: 'Error update item in cart' })
	}
}

const deleteItemFromCart = async (req, res) => {
	try {
		const { cartItemId } = req.params
		await Cart.destroy({ where: { cart_id: cartItemId } })

		res.status(200).json({ message: 'Item was deleted from cart' })
	} catch (error) {
		res.status(500).json({ message: 'Item wasn`t deleted from cart' })
	}
}
module.exports = { getUserCart, addItemInCart, calcTotalPrice, updateItemInCart, deleteItemFromCart }
