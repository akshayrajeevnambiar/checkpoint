// routes related to the tasks related operations
// primarily CRUD operations

const express = require("express");
const router = express.Router();
const taskModel = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const { parse } = require("dotenv");

// route responsible for creating a task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = new taskModel({
      userId: req.user.id,
      title: title,
      description: description,
      status: status,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;

// route responsible for fetching all tasks
// @GET
// @route /api/tasks
// @access private
router.get("/", authMiddleware, async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    orderBy = "desc",
  } = req.query;

  try {
    const tasks = await taskModel
      .find({ userId: req.user.id })
      .sort({ [sortBy]: orderBy === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalTasks = await taskModel.countDocuments({ userId: req.user.id });

    res.status(200).json({
      tasks,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// route responsible for updating a task
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const task = await taskModel.findById({ _id: req.params.id });

    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "Task not found or not authorized",
      });
    }

    await taskModel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: title,
          description: description,
          status: status,
        },
      }
    );

    return res.status(200).json({ success: "Task has been updated" + task });
  } catch (error) {
    console.log(error.message);
  }
});

// route responsible for deleting a task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await taskModel.findById({ _id: req.params.id });

    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "Task not found or not authorized",
      });
    }

    await taskModel.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: "Task has been deleted" + task });
  } catch (error) {
    console.log(error.message);
  }
});
