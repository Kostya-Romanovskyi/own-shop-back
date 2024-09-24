const sequelize = require('../config/sequelize')
const { DataTypes } = require('sequelize')
const Joi = require('joi')

const { User } = require('./users')
const { ProductsItem } = require('./productsItem')

const Cart = sequelize.define(
	'Cart',
	{
		cart_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			unique: true,
			autoIncrement: true,
		},
		users_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		products_item_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},

		cart_status: {
			type: DataTypes.ENUM('active', 'purchased', 'abandoned'),
			allowNull: false,
			defaultValue: 'active',
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		unit_price: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
	},
	{
		tableName: 'cart',
		timestamps: true,
	}
)

const cartScheme = Joi.object({
	cart_id: Joi.number().integer().positive(),
	users_id: Joi.number().integer().positive().required(),
	products_item_id: Joi.number().integer().positive().required(),
	quantity: Joi.number().integer().positive().required(),
	price: Joi.number().precision(2).positive().required(),
	unit_price: Joi.number().precision(2).positive().required(),
	cart_status: Joi.string().required(),
	createdAt: Joi.date(),
})

Cart.belongsTo(User, { foreignKey: 'users_id' })
Cart.belongsTo(ProductsItem, { foreignKey: 'products_item_id' })

module.exports = { Cart, cartScheme }
