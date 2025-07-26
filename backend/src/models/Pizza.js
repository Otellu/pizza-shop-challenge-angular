const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  price: Number,
  available: Boolean,
  image: String,
  isVegetarian: Boolean // true for vegetarian, false for non-vegetarian
});

module.exports = mongoose.model('Pizza', pizzaSchema);
