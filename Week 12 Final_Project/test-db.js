const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const TEST_DB_URI = process.env.TEST_MONGODB_URI || "mongodb://127.0.0.1:27017/test_db";

let testDb = null;

async function connectToTestDatabase() {
  try {
    const connection = await mongoose.connect(TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    testDb = connection.connection.db; // Store reference to test database
    console.log("Connected to Test Database");
  } catch (error) {
    console.error("Error connecting to Test Database:", error);
    throw error;
  }
}

function getTestDb() {
  if (!testDb) {
    throw new Error("Test database not connected. Call connectToTestDatabase() first.");
  }
  return testDb;
}

async function closeTestDatabase() {
  if (mongoose.connection) {
    await mongoose.connection.dropDatabase(); // Clear database after tests
    await mongoose.connection.close();
    console.log("Disconnected from Test Database");
    testDb = null; // Reset reference
  }
}

module.exports = { connectToTestDatabase, getTestDb, closeTestDatabase };
