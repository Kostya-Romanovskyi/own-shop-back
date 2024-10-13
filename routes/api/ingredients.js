const express = require('express');

const router = express.Router();

const { getAllIngredients, addNewIngredient } = require('../../controllers/ingredients');

// get all ingredients
router.get('/ingredients', getAllIngredients);

// add new ingredient
router.post('/ingredients', addNewIngredient);

module.exports = router;
