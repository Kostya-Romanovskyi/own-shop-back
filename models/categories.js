const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Joi = require('joi');
const { Products } = require('./products');

const Categories = sequelize.define(
	'categories',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: true,
		modelName: 'categories',
	}
);

const categoriesScheme = Joi.object({
	id: Joi.number(),
	name: Joi.string().min(4).max(15).required(),
	description: Joi.string().required(),
	image: Joi.string(),
});

const updateCategoriesScheme = Joi.object({
	name: Joi.string().min(4).max(15),
	description: Joi.string(),
	image: Joi.string(),
});

const schemes = {
	categoriesScheme,
	updateCategoriesScheme,
};

Categories.hasMany(Products, { foreignKey: 'category_id' });

module.exports = { Categories, schemes };
