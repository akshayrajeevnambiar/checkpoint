const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connection Established");
  } catch (err) {
    console.log(err.message);
  }
}

connectDB();

module.exports = connectDB;
