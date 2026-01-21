import express from "express";
import Task from "../models/taskmodel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ----------------------------
// AUTH MIDDLEWARE
// ----------------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// ----------------------------
// CREATE TASK
// ----------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, date, priority, cat } = req.body;
    if (!title || !date)
      return res.status(400).json({ message: "Title and date are required" });

    const task = await Task.create({
      userId: req.user.id,
      title,
      date,
      priority,
      cat
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// GET ALL TASKS

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// UPDATE TASK
// ----------------------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, date, priority, cat, completed } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, date, priority, cat, completed },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("Update task error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// DELETE TASK
// ----------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
