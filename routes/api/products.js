const express = require('express');

const router = express.Router();

const { authorization, upload } = require('../../middleware/index');

const {
	getAllProducts,
	addProduct,
	updateProduct,
	deleteProduct,
	getProductByName,
} = require('../../controllers/products');

//get all products
router.get('/products', getAllProducts);

// get product by name
router.get('/products/:name', getProductByName);

//add new product
router.post('/products', upload.single('image'), addProduct);

//update product
router.patch('/products/:id', upload.single('image'), authorization, updateProduct);

//delete product
router.delete('/products/:id', authorization, deleteProduct);

module.exports = router;
