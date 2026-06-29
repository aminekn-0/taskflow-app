const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboard = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // =========================
    // 1. Active projects count
    // =========================
    const activeProjectsAgg = await Project.aggregate([
      {
        $match: {
          owner: userId,
          status: "actif",
        },
      },
      {
        $count: "activeProjects",
      },
    ]);

    const activeProjects =
      activeProjectsAgg.length > 0 ? activeProjectsAgg[0].activeProjects : 0;

    // =========================
    // 2. Tasks assigned to user
    // =========================
    const assignedTasksAgg = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
        },
      },
      {
        $count: "assignedTasks",
      },
    ]);

    const assignedTasks =
      assignedTasksAgg.length > 0 ? assignedTasksAgg[0].assignedTasks : 0;

    // =========================
    // 3. Completed tasks
    // =========================
    const completedTasksAgg = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
          status: "done",
        },
      },
      {
        $count: "completedTasks",
      },
    ]);

    const completedTasks =
      completedTasksAgg.length > 0 ? completedTasksAgg[0].completedTasks : 0;

    // =========================
    // 4. Overdue tasks
    // =========================
    const overdueTasksAgg = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
          status: { $ne: "done" },
          dueDate: { $lt: new Date() },
        },
      },
      {
        $count: "overdueTasks",
      },
    ]);

    const overdueTasks =
      overdueTasksAgg.length > 0 ? overdueTasksAgg[0].overdueTasks : 0;

    // =========================
    // 5. Tasks in progress (sorted)
    // =========================
    const tasksInProgress = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
          status: "in progress",
        },
      },
      {
        $sort: {
          priority: -1,
          dueDate: 1,
        },
      },
    ]);

    // =========================
    // RESPONSE
    // =========================
    res.json({
      activeProjects,
      assignedTasks,
      completedTasks,
      overdueTasks,
      tasksInProgress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error loading dashboard",
      error: error.message,
    });
  }
};

module.exports = { getDashboard };
