const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Joi = require('joi');

const Ingredients = sequelize.define(
	'ingredients',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		allergen_info: DataTypes.STRING,
		calories: DataTypes.INTEGER,
	},
	{ timestamps: true, tableName: 'ingredients' }
);

const addIngredientScheme = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	allergen_info: Joi.string().required(),
	calories: Joi.string().required(),
});

Ingredients.belongsToMany(ProductsItem, {
	through: ProductsItemIngredients,
	foreignKey: 'ingredient_id',
	otherKey: 'products_item_id',
});

module.exports = { Ingredients, addIngredientScheme };
