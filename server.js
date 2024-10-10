require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRouter = require("./routes/UserRoute");
const taskRouter = require("./routes/TasksRoutes");

const app = express();

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());

app.use("/api/users/", userRouter);

app.use("/api/tasks/", taskRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server running on the port : " + PORT);
});
