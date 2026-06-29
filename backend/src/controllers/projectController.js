const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const { logActivity } = require("./activityController");

/**
 * POST /api/projects
 */
const createProject = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline,
      status,
      owner: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/projects?page=1&limit=5
 */
const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = { owner: req.user.id };

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    await logActivity("project_updated", project._id, req.user.id, { title: project.title });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    // IMPORTANT: needed for pre("deleteOne")
    await project.deleteOne();

    res.json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/projects/:id/members
 */
const getProjectMembers = async (req, res) => {
  try {
    const users = await User.find({}, "fullName email");
    const members = users.map(user => ({
      _id: user._id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email
    }));
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/projects/:id/tasks
 */
const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id })
      .populate("assignedTo", "fullName email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectMembers,
  getProjectTasks
};
