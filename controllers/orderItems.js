const { OrderItems, orderItemsScheme } = require('../models/orderItems')

const addOrderItem = async (req, res) => {
	try {
		const { products_item_id } = req.body

		const validateBody = orderItemsScheme.validate(req.body)

		if (validateBody.error) return res.status(409).json(validateBody.error.message)

		await OrderItems.create(req.body)

		res.status(201).json({ message: `Order item with id ${products_item_id} is already added` })
	} catch (error) {
		res.status(500).json({ message: `Failed to add order item` })
	}
}

module.exports = { addOrderItem }
