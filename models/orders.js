const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')
const Joi = require('joi')
const { OrderItems } = require('./orderItems')

const Orders = sequelize.define(
	'orders',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: DataTypes.INTEGER,
		order_date: DataTypes.DATE,
		status: DataTypes.ENUM('Pending', 'Processing', 'Delivered', 'Cancelled'),
		total_price: DataTypes.INTEGER(10, 2),
	},
	{
		tableName: 'orders',
		timestamps: false,
	}
)

const ordersScheme = Joi.object({
	id: Joi.number().integer().positive(),
	user_id: Joi.number().integer().positive().required(),
	order_date: Joi.date().required(),
	status: Joi.string().min(7).max(11).required(),
	total_price: Joi.number().precision(5).positive().precision(2).required(),
})

Orders.hasMany(OrderItems, { foreignKey: 'order_id' })

module.exports = { Orders, ordersScheme }
