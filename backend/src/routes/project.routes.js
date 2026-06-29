const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectMembers,
  getProjectTasks
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);
router.get("/:id/members", authMiddleware, getProjectMembers);
router.get("/:id/tasks", authMiddleware, getProjectTasks);

module.exports = router;
