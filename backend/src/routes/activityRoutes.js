const express = require("express");
const { protect } = require("../middlewares/auth"); // FIX: was '../middlewares/authMiddleware'
const { getActivities } = require("../controllers/activityController");

const router = express.Router({ mergeParams: true });

/**
 * GET /api/projects/:id/activities
 */
router.get("/", protect, getActivities);

module.exports = router;
