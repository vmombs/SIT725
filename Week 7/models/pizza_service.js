const { MongoClient, ObjectId } = require("mongodb");

class PizzaService {
  constructor(uri, dbName = "myDB") { // Defaults to "myDB" if no name is provided
    this.uri = uri;
    this.client = new MongoClient(uri);
    this.dbName = dbName;
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
  }

  async insertPizza(pizza) {
    const collection = this.db.collection("pizzaMenu");
    const result = await collection.insertOne(pizza);
    if (result.acknowledged) {
      return { insertedId: result.insertedId, ...pizza };
    } else {
      throw new Error("Insertion failed");
    }
  }

  async fetchAllPizzas() {
    const collection = this.db.collection("pizzaMenu");
    return await collection.find().toArray();
  }

  async fetchPizzaById(id) {
    const collection = this.db.collection("pizzaMenu");
    try {
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error fetching pizza by ID:", error);
      throw error;
    }
  }

  async deletePizza(id) {
    const collection = this.db.collection("pizzaMenu");
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }

  async close() {
    await this.client.close();
  }
}

module.exports = PizzaService;
