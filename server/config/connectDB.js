const mongoose = require("mongoose");
const config = require("./envConfig");

const connectDB = () => {
  mongoose
    .connect(config.MONGO_URI)
    .then(() => console.log("database connected successfully"))
    .catch((error) => {
      console.log("database connection failed:", error.message);
      process.exit(1);
    });
};

module.exports = connectDB;
