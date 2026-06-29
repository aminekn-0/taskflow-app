const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

/**
 * GET  /api/notifications          → all notifications for logged-in user
 * PATCH /api/notifications/read-all → mark all as read  (must be before /:id)
 * PATCH /api/notifications/:id/read → mark one as read
 */
router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, markAllAsRead);
router.patch("/:id/read", authMiddleware, markAsRead);

module.exports = router;
