const express = require('express');
const router = express.Router();

const { authorization, upload } = require('../../middleware/index');

const ctrlProdItem = require('../../controllers/productsItem');

// get all products item
router.get('/items', ctrlProdItem.getAllItems);

// GET item by id
router.get('/items/:id', ctrlProdItem.getItemById);

// ADD new product item
router.post('/items', upload.single('image'), ctrlProdItem.addNewItem);

//ADD ingredients to item
router.post('/items/:id/ingredients', ctrlProdItem.addIngredientsToItem);

// DELETE request to remove ingredients from a product item
router.delete('/items/:id/ingredients', ctrlProdItem.removeIngredientsFromItem);

// UPDATE item
router.patch('/items/:id', upload.single('image'), ctrlProdItem.updateItem);

// DELETE item
router.delete('/items/:id', authorization, ctrlProdItem.deleteItem);

module.exports = router;
