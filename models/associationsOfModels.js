const { ProductsItem } = require('./productsItem');
const { Ingredients } = require('./ingredients');
const { ProductsItemIngredients } = require('./productsItemWithIngredients');

ProductsItem.belongsToMany(Ingredients, { through: ProductsItemIngredients, foreignKey: 'products_item_id' });
Ingredients.belongsToMany(ProductsItem, { through: ProductsItemIngredients, foreignKey: 'ingredient_id' });

module.exports = { ProductsItem, Ingredients, ProductsItemIngredients };
