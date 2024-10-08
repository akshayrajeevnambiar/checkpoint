require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("server running on the port : " + PORT);
});
