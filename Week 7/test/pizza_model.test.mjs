import { expect } from "chai";
import mongoose from "mongoose";
import Pizza from "../models/pizza_model.js";

describe("Pizza Model", () => {
  before(async () => {
    await mongoose.connect("mongodb://localhost:27017/test_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    const db = mongoose.connection.useDb("test_db");
    await db.collection("pizzaMenu").deleteMany({}); // Clear pizzas before each test
  });

  afterEach(async () => {
    const db = mongoose.connection.useDb("test_db");
    await db.collection("pizzaMenu").deleteMany({}); // Ensure test isolation
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  // Test Case 1: Create Pizza Document
  it("should create a new pizza document", async () => {
    const pizza = new Pizza({
      name: "Margherita",
      ingredients: ["tomato", "mozzarella", "basil"],
      price: 10,
    });

    // Verifies that a new pizza document can be successfully created and saved to the database.
    await pizza.save();

    // Checks for the existence of the _id after saving.
    expect(pizza._id).to.exist;
  });

  // Test Case 2: Validate Minimum Price
  it("should validate minimum price", async () => {
    const pizza = new Pizza({
      name: "Margherita",
      ingredients: ["tomato", "mozzarella", "basil"],
      price: -10,
    });

    try {
      //	Ensures that the model enforces the minimum price constraint (price >= 0).
      await pizza.save();
      throw new Error("Validation should have failed");
    } catch (err) {
      //	Tests for the expected validation error when a negative price is provided.
      expect(err.errors.price).to.exist;
    }
  });

  // Test Case 3: Validate Required Fields
  it("should validate required fields", async () => {
    // Tests that the name, ingredients, and price fields are provided.
    // Create a pizza object that is missing all required fields
    const pizza = new Pizza({});

    try {
      await pizza.save();
      throw new Error("Validation should have failed");
    } catch (err) {
      // Tests for the expected validation errors if any of these are missing.
      expect(err.errors.name).to.exist;
      expect(err.errors.ingredients).to.exist;
      expect(err.errors.price).to.exist;
    }
  });

  // Test Case 4: Validate Ingredients Type
  it("should validate ingredients type and content", async () => {
    // Checks that the ingredients field is an array.
    const pizza1 = new Pizza({
      name: "test",
      price: 10,
      ingredients: "not an array",
    });

    // Checks that the ingredients field is an array of strings.
    const pizza2 = new Pizza({
      name: "test",
      price: 10,
      ingredients: [0, 1, 2],
    });

    try {
      await pizza1.save();
      throw new Error("Validation should have failed");
    } catch (err) {

      //	Tests for the validation error if a different data type is provided.
      expect(err.errors.ingredients).to.exist;
      expect(err.errors.ingredients.message).to.equal(
        "Ingredients must be an array of strings"
      );
    }

    try {
      await pizza2.save();
      throw new Error("Validation should have failed");
    } catch (err) {
      //	Tests for the validation error if a different data type is provided.
      expect(err.errors.ingredients).to.exist;
      expect(err.errors.ingredients.message).to.equal(
        "Ingredients must be an array of strings"
      );
    }
  });

  // Test Case 5: Validate Name Length
  it("should validate maximum name length", async () => {
    // Tests that the name is not greater than 50 characters.
    // Create a name longer than the limit
    const longName = "A".repeat(51);
    const pizza = new Pizza({
      name: longName,
      ingredients: ["test"],
      price: 10,
    });

    try {
      await pizza.save();
      throw new Error("Validation should have failed");
    } catch (err) {
      // Tests for the expected validation errors if the name is greater than 50 characters.
      expect(err.errors.name).to.exist;
      expect(err.errors.name.message).to.equal(
        "Pizza name is too long (maximum 50 characters)"
      );
    }
  });
});
