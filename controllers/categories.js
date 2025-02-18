const { Categories, schemes } = require("../models/categories");
const { Products } = require("../models/products");
const { cloudinary } = require("../config/cloudinary");

const fs = require("fs");

const getAllCategories = async (req, res) => {
  try {
    const result = await Categories.findAll();

    // Checking empty array
    if (result.length === 0) {
      return res.status(404).json({ error: "Categories not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getCategoriesWithProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const usersWithOrders = await Categories.findAll({
      limit,
      offset: (page - 1) * limit,
      include: [{ model: Products }],
    });

    res.json(usersWithOrders);
  } catch (error) {
    console.error("Error fetching users with orders:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch all categories with products" });
  }
};

const getCategoryByName = async (req, res) => {
  try {
    const name = req.params.name;

    const result = await Categories.findOne({
      where: { name },
      include: [{ model: Products }],
    });

    if (!result) {
      return res.status(404).json({ message: "Name of category is not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all category by name" });
  }
};

const addNewCategory = async (req, res) => {
  try {
    const newData = req.body;
    let imageUrl;
    console.log(newData);

    const validateBody = schemes.categoriesScheme.validate(newData);

    if (validateBody.error)
      return res.status(409).json(validateBody.error.message);

    const categoryExists = await Categories.findOne({
      where: { name: newData.name },
    });

    if (categoryExists) {
      return res
        .status(500)
        .json({ message: "This category name is already exists" });
    }

    if (req.file) {
      console.log(req.file);

      const { path: tempUpload } = req.file;

      const updatedImage = await cloudinary.uploader.upload(tempUpload);

      imageUrl = updatedImage.url;

      fs.unlink(tempUpload, (error) => {
        if (error)
          return console.log("Error delete file from temporary folder");
      });
    }

    const newCategory = await Categories.create({
      ...newData,
      image: imageUrl,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create category" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    let imageUrl;

    const validateBody = schemes.updateCategoriesScheme.validate(body);

    if (validateBody.error)
      return req.status(409).json(validateBody.error.message);

    if (req.file) {
      const { path: tempUpload } = req.file;

      const getAvatarUrl = await Categories.findOne({ where: { id } });

      if (getAvatarUrl && getAvatarUrl.image) {
        const publicId = getAvatarUrl.image.split("/").pop().split(".")[0];

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const updatedImage = await cloudinary.uploader.upload(tempUpload);

      imageUrl = updatedImage.url;

      fs.unlink(tempUpload, (error) => {
        if (error)
          return console.log("Error delete file from temporary folder");
      });
    }

    await Categories.update({ ...body, image: imageUrl }, { where: { id } });

    res
      .status(200)
      .json({ message: `Category ${body.name} updated successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await Categories.destroy({ where: { id } });

    res.status(200).json({ message: "Category was successfully deleted " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryByName,
  addNewCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithProducts,
};
