const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
