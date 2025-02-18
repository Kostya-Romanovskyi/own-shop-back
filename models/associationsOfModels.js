const { ProductsItem } = require("./productsItem");
const { Ingredients } = require("./ingredients");
const { ProductsItemIngredients } = require("./productsItemWithIngredients");

const { User } = require("./users");
const { Reservations } = require("./reservations");

ProductsItem.belongsToMany(Ingredients, {
  through: ProductsItemIngredients,
  foreignKey: "products_item_id",
});
Ingredients.belongsToMany(ProductsItem, {
  through: ProductsItemIngredients,
  foreignKey: "ingredient_id",
});

User.hasMany(Reservations, { foreignKey: "user_id" });
Reservations.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  ProductsItem,
  Ingredients,
  ProductsItemIngredients,
  Reservations,
  User,
};
