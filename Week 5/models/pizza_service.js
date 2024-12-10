const { MongoClient, ServerApiVersion } = require("mongodb");

class PizzaService {
    constructor(uri) {
        this.uri = uri;
        this.client = new MongoClient(uri);
    }

    async connect() {
        await this.client.connect();
        
    }

    async insertPizza(pizza) {
        const db = this.client.db("myDB");
        const collection = db.collection("pizzaMenu");
        const result = await collection.insertOne(pizza);
        return result;
    }

    async fetchAllPizzas() {
        const db = this.client.db("myDB");
        const collection = db.collection("pizzaMenu");
        const data = await collection.find().toArray();
        return data;
    }

    async close() {
        await this.client.close();
    }
}

module.exports = PizzaService;