const { User, schemas } = require('../models/users')
const { Orders } = require('../models/orders')
const { OrderItems } = require('../models/orderItems')

const getUserOrders = async (req, res) => {
	try {
		const { id } = req.params
		// const page = req.query.page || 1
		// const limit = parseInt(req.query.limit) || 10

		// if (isNaN(page) || isNaN(limit)) {
		// 	return res.status(400).json({ error: 'Invalid page or limit parameter' })
		// }

		const users = await User.findOne({
			// limit,
			// offset: (page - 1) * limit,
			include: [{ model: Orders, include: [{ model: OrderItems }] }],
			where: { id },
		})

		res.status(200).json(users)
	} catch (error) {
		console.error('Error fetching users:', error)
		res.status(500).json({ error: 'Error fetching users' })
	}
}

module.exports = { getUserOrders }
