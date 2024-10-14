const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Joi = require('joi');
const { OrderItems } = require('./orderItems');

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
		chopsticks: DataTypes.ENUM('yes', 'no'),
		chopsticks_quantity: DataTypes.NUMBER,
		soy_sauce: DataTypes.STRING,
		allergic: DataTypes.STRING,
		type_of_allergy: DataTypes.STRING,
		additional_information: DataTypes.STRING,
	},
	{
		tableName: 'orders',
		timestamps: false,
	}
);

const ordersScheme = Joi.object({
	id: Joi.number().integer().positive(),
	user_id: Joi.number().integer().positive().required(),
	order_date: Joi.date().required(),
	status: Joi.string().min(7).max(11).required(),
	total_price: Joi.number().precision(5).positive().precision(2).required(),
	chopsticks: Joi.string().required(),
	chopsticks_quantity: Joi.number().required(),
	soy_sauce: Joi.string().required(),
	allergic: Joi.string().required(),
	type_of_allergy: Joi.string().required(),
	additional_information: Joi.string().required(),
});

Orders.hasMany(OrderItems, { foreignKey: 'order_id' });

module.exports = { Orders, ordersScheme };
