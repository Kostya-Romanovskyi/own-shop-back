const { Ingredients } = require('../models/ingredients');

const getAllIngredients = async (req, res) => {
	try {
		const result = await Ingredients.findAll();
		res.status(200).json(result);
	} catch (error) {
		console.error('Error fetching ingredients:', error); // Логируем ошибку
		res.status(500).json({ message: 'Server error Ingredients' });
	}
};

const addNewIngredient = async (req,res)=>{
	try {
		
	} catch (error) {
		
	}
}

module.exports = { getAllIngredients };
