const express = require('express');

const router = express.Router();

const { getAllIngredients } = require('../../controllers/ingredients');

// add order item
router.get('/ingredients', getAllIngredients);

module.exports = router;
