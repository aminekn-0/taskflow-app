const express = require("express");
const router = express.Router();
const Task = require("../src/models/Task");
const Project = require("../src/models/Project");
const authMiddleware = require("../src/middleware/auth.middleware");

// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        // Active projects
        const activeProjects = await Project.countDocuments({
            $or: [{ owner: userId }, { members: userId }],
            status: "actif"
        });

        // Assigned tasks
        const assignedTasks = await Task.countDocuments({ assignedTo: userId });

        // Completed tasks
        const completedTasks = await Task.countDocuments({
            assignedTo: userId,
            status: "done"
        });

        // Late tasks
        const lateTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "done" },
            dueDate: { $lt: now }
        });

        res.json({
            success: true,
            activeProjects,
            assignedTasks,
            completedTasks,
            lateTasks
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;