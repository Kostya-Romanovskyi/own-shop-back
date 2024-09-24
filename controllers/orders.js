const { Orders, ordersScheme } = require('../models/orders')
const { OrderItems } = require('../models/orderItems')
const { User } = require('../models/users')
const { Cart } = require('../models/cart')
const { ProductsItem } = require('../models/productsItem')

const getAllOrders = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query
		const result = await Orders.findAll({ limit, offset: (page - 1) * limit, include: [OrderItems] })
		res.status(200).json(result)
	} catch (error) {
		res.status(500).json('Failed to fetch all orders')
	}
}

const getUserOrders = async (req, res) => {
	try {
		const { userId } = req.params

		// Найти все заказы пользователя с включением элементов заказа и продуктов
		const response = await Orders.findAll({
			where: { user_id: userId },
			include: [
				{
					model: OrderItems,
					include: [
						{
							model: ProductsItem, // предполагается, что есть модель Products
							attributes: ['id', 'name', 'price', 'image'], // перечислить необходимые атрибуты
						},
					],
				},
			],
		})

		// Если вы хотите модифицировать или фильтровать данные перед отправкой ответа:
		const result = response.map(({ id, status, total_price, createdAt, order_items }) => ({
			id: id,
			status: status,
			totalPrice: total_price,
			createdAt: createdAt,
			order_items: order_items.map(({ id, quantity, price, createdAt, products_item }) => ({
				id: id,
				quantity: quantity,
				price: price,
				createdAt: createdAt,
				product: products_item,
			})),
		}))

		res.status(200).json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to fetch all user orders' })
	}
}

const getOrderItems = async (req, res) => {
	try {
		const { orderId } = req.params

		const result = await OrderItems.findAll({ where: { order_Id: orderId } })

		res.status(200).json(result)
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch order items' })
	}
}

const addOrder = async (req, res) => {
	try {
		const itemsInCart = await Cart.findAll({ where: { users_id: req.body.user_id } })

		let calcTotalPrice = itemsInCart.reduce((total, { price, quantity }) => total + price * quantity, 0)
		const totalPrice = calcTotalPrice.toFixed(2)
		// Создание заказа
		const order = await Orders.create({ ...req.body, total_price: +totalPrice })

		// Привязка заказа к пользователю
		const user = await User.findByPk(req.body.user_id)
		await user.addOrder(order)

		// Если есть позиции заказа, добавьте их
		if (itemsInCart && itemsInCart.length > 0) {
			await OrderItems.bulkCreate(
				itemsInCart.map(({ products_item_id, quantity, price }) => ({
					order_id: order.id,
					products_item_id,
					quantity,
					price: price * quantity,
				}))
			)
		}
		res.status(201).json(order)
	} catch (error) {
		console.error('Error creating order:', error)
		res.status(500).json({ error: 'Failed to create an order' })
	}
}

module.exports = { getAllOrders, getUserOrders, getOrderItems, addOrder }
