const { DataTypes } = require('sequelize');
const Joi = require('joi');
const sequelize = require('../config/sequelize');

const ProductsItem = sequelize.define(
	'products_item',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		price: DataTypes.DECIMAL,
		products_id: DataTypes.INTEGER,
		image: DataTypes.STRING,
		type: DataTypes.ENUM('food', 'product'),
	},
	{
		timestamps: true,
		tableName: 'products_item',
	}
);

const productsItemScheme = Joi.object({
	id: Joi.number(),
	name: Joi.string().min(4).max(25).required(),
	description: Joi.string().required(),
	price: Joi.number().precision(5).positive().precision(2).required(),
	products_id: Joi.number().required(),
	image: Joi.string(),
	type: Joi.string().valid('food', 'product').required(), // Убедитесь, что тип valid
});

const updateProductsItemScheme = Joi.object({
	name: Joi.string().min(4).max(20),
	description: Joi.string(),
	price: Joi.number().precision(5).positive().precision(2),
	image: Joi.string(),
});

const scheme = {
	productsItemScheme,
	updateProductsItemScheme,
};

module.exports = { ProductsItem, scheme };
