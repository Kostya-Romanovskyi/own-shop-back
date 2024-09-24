const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize')
const Joi = require('joi')
const { ProductsItem } = require('./productsItem')

const OrderItems = sequelize.define(
	'order_items',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		order_id: DataTypes.INTEGER,
		products_item_id: DataTypes.INTEGER,
		quantity: DataTypes.INTEGER,
		price: DataTypes.DECIMAL(10, 2),
	},
	{
		tableName: 'order_items',
		timestamps: true,
	}
)

const orderItemsScheme = Joi.object({
	id: Joi.number().integer().positive(),
	order_id: Joi.number().integer().positive().required(),
	products_item_id: Joi.number().integer().positive().required(),
	quantity: Joi.number().positive().required(),
	price: Joi.number().precision(5).positive().precision(2).required(),
})

OrderItems.belongsTo(ProductsItem, { foreignKey: 'products_item_id' })

module.exports = { OrderItems, orderItemsScheme }
