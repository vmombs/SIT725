const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Pizza name is required"],
    maxlength: [50, "Pizza name is too long (maximum 50 characters)"],
  },
  ingredients: {
    type: mongoose.Schema.Types.Mixed, // Prevents automatic type casting
    required: [true, "Ingredients are required"],
    validate: {
      validator: function (value) {
        // Ensure it's an actual array
        if (!Array.isArray(value)) return false;
        // Ensure all elements are strictly strings
        return value.length > 0 && value.every((item) => typeof item === "string");
      },
      message: "Ingredients must be an array of strings",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
});

const Pizza = mongoose.model("Pizza", pizzaSchema);

module.exports = Pizza;
