const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Ingredients = sequelize.define(
	'ingredients',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true, // Не забудьте добавить автоинкремент
		},
		name: DataTypes.STRING,
		description: DataTypes.STRING,
		allergen_info: DataTypes.STRING,
		calories: DataTypes.INTEGER,
	},
	{ timestamps: true, tableName: 'ingredients' }
);

module.exports = { Ingredients };
