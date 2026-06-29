const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth.middleware"); // FIX: correct path

// Validation middleware
const validateTask = (req, res, next) => {
  const { title, priority, status } = req.body;
  const validPriorities = ["low", "medium", "high"];
  const validStatuses   = ["todo", "in progress", "done"];

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Le titre est obligatoire" });
  }
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ message: `Priorité invalide : ${priority}` });
  }
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Statut invalide : ${status}` });
  }
  next();
};

// GET /api/tasks/my-tasks — MUST be before /:id to avoid conflict
router.get('/tasks/my-tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'fullName email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/:id/tasks
router.get("/projects/:id/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id })
      .populate("assignedTo", "fullName email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks
router.post("/tasks", authMiddleware, validateTask, async (req, res) => {
  try {
    const task = new Task({
      title:       req.body.title,
      description: req.body.description,
      priority:    req.body.priority,
      status:      req.body.status,
      dueDate:     req.body.dueDate,
      project:     req.body.project,
      assignedTo:  req.body.assignedTo || null,
    });
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/tasks/:id
router.get("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id
router.put("/tasks/:id", authMiddleware, validateTask, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title:       req.body.title,
        description: req.body.description,
        priority:    req.body.priority,
        status:      req.body.status,
        dueDate:     req.body.dueDate,
        assignedTo:  req.body.assignedTo,
      },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id/status
router.patch("/tasks/:id/status", authMiddleware, async (req, res) => {
  const validStatuses = ["todo", "in progress", "done"];
  const { status } = req.body;

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Statut invalide : ${status}` });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
