require('dotenv').config({ path: __dirname + '/.env' });

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI; // Atlas URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db = null;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME); // Assign database after connection
        console.log("Connected to MongoDB Atlas!");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
        throw error;
    }
}

function getDb() {
    if (!db) {
        throw new Error("Database not connected. Call connectToDatabase() first.");
    }
    return db;
}

async function closeConnection() {
    if (client) {
        await client.close();
        console.log("MongoDB Atlas connection closed.");
        db = null; // Resetting db reference
    }
}

module.exports = { connectToDatabase, getDb, closeConnection };
