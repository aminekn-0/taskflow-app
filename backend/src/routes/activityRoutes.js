const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const { getActivities } = require("../controllers/activityController");

const router = express.Router({ mergeParams: true }); // needed to access :id from parent

/**
 * GET /api/projects/:id/activities
 */
router.get("/", authMiddleware, getActivities);

module.exports = router;
