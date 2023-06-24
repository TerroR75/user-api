const mongoose = require("mongoose");

const dbName = "UserAPI";

const url = `mongodb://127.0.0.1:27017/${dbName}`;

async function connectToDatabase() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB (${dbName})`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectToDatabase;
