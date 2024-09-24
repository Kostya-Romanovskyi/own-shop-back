const { cloudinary, getCloudOptions } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

const { ProductsItem, scheme } = require('../models/productsItem');

const getAllItems = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;

		const result = await ProductsItem.findAll({
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

		const result = await ProductsItem.findOne({ where: { id } });

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: 'Error fetch item by id' });
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

		await ProductsItem.destroy({ where: { id } });

		res.status(200).json({ message: 'Item was successfully deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete item' });
	}
};

module.exports = { getAllItems, getItemById, addNewItem, updateItem, deleteItem };
