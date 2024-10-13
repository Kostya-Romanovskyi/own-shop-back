const express = require('express');

const router = express.Router();

// const authorization = require('../../middleware/authorization')
const { authorization, upload } = require('../../middleware/index');

const ctrlCategories = require('../../controllers/categories');

//get all categories
router.get('/categories', ctrlCategories.getAllCategories);

//get category by id
// router.get('/categories/:id', ctrlCategories.getCategoryById)

//get category by name
router.get('/categories/:name', ctrlCategories.getCategoryByName);

//create category
router.post('/categories', upload.single('image'), ctrlCategories.addNewCategory);

//update category
router.patch('/categories/:id', upload.single('image'), authorization, ctrlCategories.updateCategory);

//delete category
router.delete('/categories/:id', authorization, ctrlCategories.deleteCategory);

module.exports = router;
