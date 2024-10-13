const { Ingredients, addIngredientScheme } = require('../models/ingredients');

const getAllIngredients = async (req, res) => {
	try {
		const result = await Ingredients.findAll();
		res.status(200).json(result);
	} catch (error) {
		console.error('Error fetching ingredients:', error); // Логируем ошибку
		res.status(500).json({ message: 'Server error Ingredients' });
	}
};

const addNewIngredient = async (req, res) => {
	try {
		const { name } = req.body;
		const validateBody = addIngredientScheme.validate(req.body);

		if (validateBody.error) return res.status(409).json(validateBody.error.message);

		const existedIngredient = await Ingredients.findOne({ where: { name } });

		if (existedIngredient) return res.status(409).json({ message: `Ingredient with name ${name} is already exist` });

		await Ingredients.create(req.body);

		res.status(201).json({ message: `Ingredient ${name} successfully added` });
	} catch (error) {
		res.status(500).json({ message: `Failed to add order item`, error });
	}
};

module.exports = { getAllIngredients, addNewIngredient };
