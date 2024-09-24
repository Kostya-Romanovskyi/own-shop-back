const { Products, schemes } = require('../models/products');
const { ProductsItem } = require('../models/productsItem');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

const getAllProducts = async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;

		const result = await Products.findAll({
			limit,
			offset: (page - 1) * limit,
			include: { model: ProductsItem },
		});

		// const result = await Products.findAll();
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch all products' });
	}
};

const getProductByName = async (req, res) => {
	try {
		const { name } = req.params;
		console.log(name);

		const result = await Products.findOne({
			include: [{ model: ProductsItem }],
			where: { name },
		});

		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch product by name' });
	}
};

const addProduct = async (req, res) => {
	try {
		const validateBody = schemes.productsScheme.validate(req.body);

		if (validateBody.error) {
			return res.status(500).json({ message: validateBody.error.message });
		}

		const { name } = req.body;
		let avatarUrl;

		const existingProduct = await Products.findOne({ where: { name } });

		if (existingProduct) {
			return res.status(409).json({ error: `Product ${name} already exists` });
		}

		if (req.file) {
			const { path: tempUpload, originalname } = req.file;

			const cloudOptions = {
				public_id: `${Date.now()}`,
				use_filename: true,
				unique_filename: false,
				overwrite: true,
			};

			const result = await cloudinary.uploader.upload(tempUpload, cloudOptions);

			avatarUrl = result.url;

			fs.unlink(tempUpload, error => {
				if (error) return console.log('Error delete file from temporary folder');
			});

			console.log('Temporary file successfully deleted');
		}

		const newProduct = await Products.create({ ...req.body, image: avatarUrl });

		res.status(201).json(newProduct);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to add product' });
	}
};

const updateProduct = async (req, res) => {
	try {
		const id = req.params.id;
		const { name } = req.body;

		let imageUrl;

		const validateBody = schemes.updateProductsScheme.validate(req.body);
		if (validateBody.error) {
			return res.status(400).json({ error: validateBody.error.message });
		}

		const product = await Products.findOne({ where: { id } });
		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		if (name) {
			const existedName = await Products.findOne({ where: { name } });
			if (existedName && existedName.id !== id) {
				return res.status(409).json({ error: `Product with name "${name}" already exists` });
			}
		}

		// Upload new image
		if (req.file) {
			const { path: tempUpload } = req.file;
			const currentImage = product.image;

			if (currentImage) {
				const publicId = currentImage.split('/').pop().split('.')[0];

				// Removing old image from Cloudinary
				if (publicId) {
					await cloudinary.uploader.destroy(publicId);
				}
			}

			// downloading new image in Cloudinary
			const uploadedImage = await cloudinary.uploader.upload(tempUpload);
			imageUrl = uploadedImage.url;

			// deleting temporary file
			fs.unlink(tempUpload, error => {
				if (error) {
					console.log('Error deleting file from temporary folder:', error);
				}
			});
		}

		// Updating data in DB
		await Products.update(
			{ ...req.body, image: imageUrl || product.image }, // If without image, we leave a new image
			{ where: { id } }
		);

		res.status(200).json({ message: 'Product successfully updated' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update product' });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const id = req.params.id;

		await Products.destroy({ where: { id } });

		res.status(200).json({ message: 'Product successfully was deleted' });
	} catch (error) {
		res.status(500).json({ error: 'Bad request to delete product' });
	}
};

module.exports = { getAllProducts, getProductByName, addProduct, updateProduct, deleteProduct };
