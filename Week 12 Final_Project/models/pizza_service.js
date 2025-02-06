const { ObjectId } = require("mongodb");
const { connectToDatabase, getDb, closeConnection } = require("../db");
const { connectToTestDatabase, getTestDb, closeTestDatabase } = require ("../test-db")

class PizzaService {
  constructor() {
    this.db = null;
  }

  async connect() {
    try {
      await connectToDatabase();
      this.db = getDb();  // Get database instance
      console.log("PizzaService connected to DB");
    } catch (error) {
      console.error("Error in PizzaService connect", error);
      throw error;
    }
  }

  async connectToTest() {
    try {
      await connectToTestDatabase();
      this.db = getTestDb();  // Get database instance
      console.log("PizzaService connected to Test DB");
    } catch (error) {
      console.error("Error in PizzaService connect to Test DB", error);
      throw error;
    }
  }

  async insertPizza(pizza) {
    await this.ensureConnection();
    const collection = this.db.collection("pizzaMenu");
    const result = await collection.insertOne(pizza);
    if (result.acknowledged) {
      return { insertedId: result.insertedId, ...pizza };
    } else {
      throw new Error("Insertion failed");
    }
  }

  async fetchAllPizzas() {
    await this.ensureConnection();
    const collection = this.db.collection("pizzaMenu");
    return await collection.find().toArray();
  }

  async fetchPizzaById(id) {
    await this.ensureConnection();
    const collection = this.db.collection("pizzaMenu");
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  async deletePizza(id) {
    await this.ensureConnection();
    const collection = this.db.collection("pizzaMenu");
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }

  async ensureConnection() {
    if (!this.db) {
      await this.connect();
    }
  }

  async close() {
    await closeConnection();
    this.db = null;
  }

  async closeTest() {
    await closeTestDatabase();
    this.db = null;
  }
}

module.exports = PizzaService;
