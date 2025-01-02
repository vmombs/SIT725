const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    name: String, 
    ingredients: [String], 
    price: { 
      type: Number, 
      required: true, 
      min: 0 // Ensure price is greater than or equal to 0
    }
  });

const Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;