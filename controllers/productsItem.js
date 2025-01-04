const { cloudinary, getCloudOptions } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

const { ProductsItem, scheme } = require('../models/productsItem');
const { Ingredients } = require('../models/ingredients');
const { log } = require('console');

const getAllItems = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;

		const result = await ProductsItem.findAll({
			include: { model: Ingredients, attributes: ['name'] },
			page,
			offset: (page - 1) * limit,
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch all items' });
	}
};

const getItemById = async (req, res) => {
	try {
		const { id } = req.params;

		const result = await ProductsItem.findOne({
			where: { id },
			include: { model: Ingredients, attributes: ['id', 'name', 'description', 'allergen_info', 'calories'] },
		});

		res.status(200).json(result);
	} catch (error) {
		console.log(error);

		res.status(500).json({ error: 'Error fetch item by id' });
	}
};

const getItemsByName = async (req, res) => {
	try {
		const { name } = req.params;

		const result = await ProductsItem.findAll({
			where: {
				name: {
					[Op.like]: `%${name}%`, // Partial match search
				},
			},
			include: {
				model: Ingredients,
				attributes: ['id', 'name', 'description', 'allergen_info', 'calories'],
			},
		});

		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Error fetching items by name' });
	}
};

const addIngredientsToItem = async (req, res) => {
	const { id } = req.params;
	const { ingredientIds } = req.body;

	try {
		// Find item by id
		const item = await ProductsItem.findByPk(id);
		if (!item) {
			return res.status(404).json({ error: 'Item not found' });
		}

		// Get existing ingredients for the item
		const existingIngredients = await item.getIngredients();

		// Create a Set of existing ingredient IDs for quick lookup
		const existingIngredientIds = new Set(existingIngredients.map(ingredient => ingredient.id));

		// Separate new ingredients and existing ones
		const newIngredientIds = [];
		const existingIngredientDetails = [];

		ingredientIds.forEach(ingredientId => {
			if (existingIngredientIds.has(ingredientId)) {
				existingIngredientDetails.push(ingredientId); // Track existing ingredient IDs
			} else {
				newIngredientIds.push(ingredientId); // Track new ingredient IDs
			}
		});

		// Adding new ingredients to item
		if (newIngredientIds.length > 0) {
			await item.addIngredients(newIngredientIds);
		}

		// Prepare response message
		const responseMessage = {
			message: 'Ingredients processed successfully',
			added: newIngredientIds.length > 0 ? newIngredientIds : undefined,
			existing: existingIngredientDetails.length > 0 ? existingIngredientDetails : undefined,
		};

		return res.status(200).json(responseMessage);
	} catch (error) {
		console.error('Error adding ingredients to item:', error);
		return res.status(500).json({ error: 'Error adding ingredients to item' });
	}
};

const removeIngredientsFromItem = async (req, res) => {
	const { id } = req.params; // ID of the product item
	const { ingredientIds } = req.body; // Array of ingredient IDs to remove

	try {
		// Find item by id
		const item = await ProductsItem.findByPk(id);
		if (!item) {
			return res.status(404).json({ error: 'Item not found' });
		}

		// Get existing ingredients for the item
		const existingIngredients = await item.getIngredients();

		// Create a Set of existing ingredient IDs for quick lookup
		const existingIngredientIds = new Set(existingIngredients.map(ingredient => ingredient.id));

		// Separate ingredients to remove and those that do not exist
		const removedIngredientIds = [];
		const notFoundIngredientDetails = [];

		ingredientIds.forEach(ingredientId => {
			if (existingIngredientIds.has(ingredientId)) {
				removedIngredientIds.push(ingredientId); // Track ingredient IDs to be removed
			} else {
				notFoundIngredientDetails.push(ingredientId); // Track IDs that were not found
			}
		});

		// Removing ingredients from item
		if (removedIngredientIds.length > 0) {
			await item.removeIngredients(removedIngredientIds);
		}

		// Prepare response message
		const responseMessage = {
			message: 'Ingredients processed successfully',
			removed: removedIngredientIds.length > 0 ? removedIngredientIds : undefined,
			notFound: notFoundIngredientDetails.length > 0 ? notFoundIngredientDetails : undefined,
		};

		return res.status(200).json(responseMessage);
	} catch (error) {
		console.error('Error removing ingredients from item:', error);
		return res.status(500).json({ error: 'Error removing ingredients from item' });
	}
};

const addNewItem = async (req, res) => {
	try {
		const validateBody = scheme.productsItemScheme.validate(req.body);

		if (validateBody.error) {
			return res.status(500).json(validateBody.error.message);
		}

		const { name } = req.body;

		const existedName = await ProductsItem.findOne({ where: { name } });

		if (existedName) return res.status(409).json({ message: `Item ${name} is already exist` });

		let imageUrl;

		if (req.file) {
			const { path: tempUpload, originalname } = req.file;

			const result = await cloudinary.uploader.upload(tempUpload, getCloudOptions());

			imageUrl = result.url;
		} else {
			imageUrl = path.join('products', 'defaultImage.svg');
		}

		await ProductsItem.create({ ...req.body, image: imageUrl });

		res.status(201).json({ message: `Item ${name} is already added` });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Failed to add new item' });
	}
};

const updateItem = async (req, res) => {
	try {
		const { name, description } = req.body;
		const { id } = req.params;

		const validateBody = scheme.updateProductsItemScheme.validate(req.body);

		if (validateBody.error) return res.status(409).json(validateBody.error.message);

		if (name) {
			const existedName = await ProductsItem.findOne({ where: { name } });
			if (existedName) return res.status(409).json({ error: `Item ${name} is already exist` });
		}

		if (description) {
			const existedDescription = await ProductsItem.findOne({ where: { description } });
			if (existedDescription) return res.status(409).json({ error: `Item with this description is already exist` });
		}

		const getImageUrl = await ProductsItem.findOne({ where: { id } });

		// delete previous image from claudinary
		if (getImageUrl.image) {
			const publicId = getImageUrl.image.split('/').pop().split('.')[0];
			await cloudinary.uploader.destroy(publicId);
		}

		let imageUrl;

		if (req.file) {
			const { path: tempUpload } = req.file;

			// add new image to cloudinary
			const result = await cloudinary.uploader.upload(tempUpload, getCloudOptions());

			imageUrl = result.url;

			// delete file from temporary folder
			fs.unlink(tempUpload, error => {
				if (error) return console.log('Error deleting the temporary file:', error);
				console.log('Temporary file successfully deleted ');
			});
		}

		await ProductsItem.update({ ...req.body, image: imageUrl }, { where: { id } });

		res.status(200).json({ message: `Item ${name ? name : `with id: ${id}`} was successfully updated` });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update item' });
	}
};

const deleteItem = async (req, res) => {
	try {
		const { id } = req.params;

		const result = await ProductsItem.destroy({ where: { id } });

		if (result === 0) {
			return res.status(404).json({ message: 'Item not found' });
		}

		res.status(200).json({ message: 'Item was successfully deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete item' });
	}
};

module.exports = {
	getAllItems,
	getItemById,
	getItemsByName,
	addNewItem,
	updateItem,
	deleteItem,
	addIngredientsToItem,
	removeIngredientsFromItem,
};
