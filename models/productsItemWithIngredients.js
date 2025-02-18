const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const { ProductsItem } = require("./productsItem");
const { Ingredients } = require("./ingredients");

const ProductsItemIngredients = sequelize.define(
  "products_item_ingredients",
  {
    products_item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ProductsItem,
        key: "id",
      },
    },
    ingredient_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Ingredients,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

module.exports = { ProductsItemIngredients };
