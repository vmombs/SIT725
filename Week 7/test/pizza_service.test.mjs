import { expect } from "chai";
import mongoose from "mongoose";
import PizzaService from "../models/pizza_service.js";

describe("PizzaService", () => {
  let pizzaService;
  
  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/test_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    pizzaService = new PizzaService("mongodb://localhost:27017", "test_db"); // Here we are specifying that we want to use test_db
    await pizzaService.connect();
  
    const db = mongoose.connection.useDb("test_db");
    // Wait for deletion to complete
    await db.collection("pizzaMenu").deleteMany({});
  });
  

  afterEach(async () => {
    await pizzaService.close();
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  // Test Case 1: Insert Pizza
  it("should insert a new pizza", async () => {
    const pizza = {
      name: "Pepperoni",
      ingredients: ["tomato", "mozzarella", "pepperoni"],
      price: 12,
    };

    // Verifies that the insertPizza method correctly inserts a new pizza document into the database.
    const result = await pizzaService.insertPizza(pizza);
    // Checks that the returned object has an insertedId.
    expect(result.insertedId).to.exist;
  });

  // Test Case 2: Fetch All Pizzas
  it("should fetch all pizzas", async () => {
    const pizzas = await pizzaService.fetchAllPizzas();
    // Confirms that the fetchAllPizzas method returns an array of pizza objects.
    expect(pizzas).to.be.an("array");
  });

  // Test Case 3: Insert Pizza with Existing ID
  it("should insert a new pizza with an existing ID", async () => {
    const pizza = {
      _id: new mongoose.Types.ObjectId(),
      name: "Pepperoni",
      ingredients: ["tomato", "mozzarella", "pepperoni"],
      price: 12,
    };
    try {
      //	Tests the behaviour of insertPizza when trying to insert a pizza object that already has an _id property.
      await pizzaService.insertPizza(pizza);
      throw new Error("Insertion should have failed");
    } catch (error) {
      // Tests for the expected validation errors for duplicate ids
      expect(error).to.be.an("error");
    }
  });

  // Test Case 4: Fetch All Pizzas - Empty Database
  it("should fetch all pizzas - empty database", async () => {
    // First, we clear the collection
    await mongoose.connection.db.collection("pizzaMenu").deleteMany({});

    // Verifies that fetchAllPizzas function returns an empty array when the database collection is empty.
    const pizzas = await pizzaService.fetchAllPizzas();
    console.log("Pizzas", pizzas)
    expect(pizzas).to.be.an("array").that.is.empty;
  });

  // Test Case 5: Fetch Pizza By ID
  it("should fetch pizza by ID", async () => {
    const pizza = {
      name: "Margherita",
      ingredients: ["tomato", "mozzarella"],
      price: 10,
    };
    const insertedPizza = await pizzaService.insertPizza(pizza);
    const fetchedPizza = await pizzaService.fetchPizzaById(insertedPizza._id);
    // Verifies that fetchPizzaById function retrieves a specific pizza by its ID.
    expect(fetchedPizza).to.be.an("object");
    expect(fetchedPizza.name).to.equal("Margherita");
  });

  // Test Case 6: Delete Pizza
  it("should delete a pizza", async () => {
    const pizza = { name: "ToDelete", ingredients: ["test"], price: 10 };
    const insertedPizza = await pizzaService.insertPizza(pizza);
    const insertedId = insertedPizza._id;

    const deleteResult = await pizzaService.deletePizza(insertedId);

    // Verifies that deletePizza function removes a pizza from the database.
    expect(deleteResult.deletedCount).to.equal(1);

    // Attempt to fetch the deleted pizza to confirm it's gone
    const fetchedPizza = await pizzaService.fetchPizzaById(insertedId);
    expect(fetchedPizza).to.be.null;
  });
});
