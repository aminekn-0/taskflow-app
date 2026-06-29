const express = require("express");
const router = express.Router();
const Task = require("../src/models/Task");
const authMiddleware = require("../src/middleware/auth.middleware");

// — Middleware de validation —
const validateTask = (req, res, next) => {
  const { title, priority, status } = req.body;
  const validPriorities = ["low", "medium", "high"];
  const validStatuses = ["todo", "in progress", "done"];

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

// — GET toutes les tâches d"un projet —
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

// — GET tâches assignées à l'utilisateur connecté —
// GET /api/tasks/my-tasks
// IMPORTANT: This route MUST be before /:id, otherwise "my-tasks" is treated as an ID
router.get('/my-tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'fullName email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// — CREATE une tâche —
// POST /api/tasks
router.post("/", authMiddleware, validateTask, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
      dueDate: req.body.dueDate,
      project: req.body.project,
    });
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// — GET une tâche par ID —
// GET /api/tasks/:id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// — UPDATE une tâche —
// PUT /api/tasks/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        dueDate: req.body.dueDate,
        assignedTo: req.body.assignedTo,
      },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// — DELETE une tâche —
// DELETE /api/tasks/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// — PATCH statut uniquement —
// PATCH /api/tasks/:id/status
router.patch("/:id/status", authMiddleware, async (req, res) => {
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