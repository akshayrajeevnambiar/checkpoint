const mongoose = require("mongoose");

// defining the task shcema
const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// defining a task model
const taskModel = new mongoose.model("task", taskSchema);

module.exports = taskModel;
