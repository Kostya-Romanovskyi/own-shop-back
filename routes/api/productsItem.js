const express = require('express');
const router = express.Router();

const { authorization, upload } = require('../../middleware/index');

const ctrlProdItem = require('../../controllers/productsItem');

// get all products item
router.get('/items', ctrlProdItem.getAllItems);

// get item by id
router.get('/items/:id', ctrlProdItem.getItemById);

// add new product item
router.post('/items', upload.single('image'), ctrlProdItem.addNewItem);

//add ingredients to item
router.post('/items/:id/ingredients', ctrlProdItem.addIngredientsToItem);

// update item
router.patch('/items/:id', upload.single('image'), ctrlProdItem.updateItem);

// delete item
router.delete('/items/:id', authorization, ctrlProdItem.deleteItem);

module.exports = router;
