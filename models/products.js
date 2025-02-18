const { DataTypes } = require("sequelize");
const Joi = require("joi");

const sequelize = require("../config/sequelize");
const { ProductsItem } = require("./productsItem");

const Products = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    modelName: "Products",
    tableName: "products",
  }
);

Products.hasMany(ProductsItem, { foreignKey: "products_id" });

const productsScheme = Joi.object({
  id: Joi.number().integer().positive(),
  name: Joi.string().min(4).max(20).required(),
  category_id: Joi.number().required(),
  description: Joi.string().required(),
  image: Joi.string(),
});

const updateProductsScheme = Joi.object({
  name: Joi.string().min(4).max(20),
  description: Joi.string(),
  image: Joi.string(),
});

const schemes = {
  productsScheme,
  updateProductsScheme,
};

module.exports = { Products, schemes };
