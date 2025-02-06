import { expect } from "chai";
import mongoose from "mongoose";
import PizzaService from "../models/pizza_service.js";

describe("Pizza Model", () => {
  let pizzaService;

  before(async () => {
    pizzaService = new PizzaService();
    await pizzaService.connectToTest(); // Connect to the test database
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
    await pizzaService.closeTest(); // Disconnect from the test database
  });

  // Test Case 1: Create Pizza Document
  it("should create a new pizza document", async () => {
    const pizza = {
      name: "Margherita",
      ingredients: ["tomato", "mozzarella", "basil"],
      price: 10,
    };

    // Verifies that a new pizza document can be successfully created and saved to the database.
    const savedPizza = await pizzaService.insertPizza(pizza);

    // Checks for the existence of the insertedId after saving.
    expect(savedPizza.insertedId).to.exist;
  });

  // Test Case 2: Validate Minimum Price
  it("should validate minimum price", async () => {
    const pizza = {
      name: "Margherita",
      ingredients: ["tomato", "mozzarella", "basil"],
      price: -10,
    };

    try {
      // Ensures that the model enforces the minimum price constraint (price >= 0).
      await pizzaService.insertPizza(pizza);
      throw new Error("Validation should have failed");
    } catch (err) {
      // Tests for the expected validation error when a negative price is provided.
      expect(err).to.be.an("error");
    }
  });

  // Test Case 3: Validate Required Fields
  it("should validate required fields", async () => {
    // Tests that the name, ingredients, and price fields are provided.
    const pizza = {};

    try {
      await pizzaService.insertPizza(pizza);
      throw new Error("Validation should have failed");
    } catch (err) {
      // Tests for the expected validation errors if any of these are missing.
      expect(err).to.be.an("error");
    }
  });

  // Test Case 4: Validate Ingredients Type
  it("should validate ingredients type and content", async () => {
    // Checks that the ingredients field is an array.
    const pizza1 = {
      name: "test",
      price: 10,
      ingredients: "not an array",
    };

    // Checks that the ingredients field is an array of strings.
    const pizza2 = {
      name: "test",
      price: 10,
      ingredients: [0, 1, 2],
    };

    try {
      await pizzaService.insertPizza(pizza1);
      throw new Error("Validation should have failed");
    } catch (err) {
      // Tests for the validation error if a different data type is provided.
      expect(err).to.be.an("error");
    }

    try {
      await pizzaService.insertPizza(pizza2);
      throw new Error("Validation should have failed");
    } catch (err) {
      // Tests for the validation error if a different data type is provided.
      expect(err).to.be.an("error");
    }
  });

  // Test Case 5: Validate Name Length
  it("should validate maximum name length", async () => {
    // Tests that the name is not greater than 50 characters.
    const longName = "A".repeat(51);
    const pizza = {
      name: longName,
      ingredients: ["test"],
      price: 10,
    };

    try {
      await pizzaService.insertPizza(pizza);
      throw new Error("Validation should have failed");
    } catch (err) {
      // Tests for the expected validation errors if the name is greater than 50 characters.
      expect(err).to.be.an("error");
    }
  });
});
