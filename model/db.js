const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb);

mongoose.connection.on("connected", () => {
  console.log(`Database connection successful: ${uriDb}`);
});

mongoose.connection.on("error", (evt) => {
  console.log(`Error database connection: ${evt.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Database connection terminated");
});

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Database connection terminated");
    process.exit(1);
  });
});

module.exports = db;
