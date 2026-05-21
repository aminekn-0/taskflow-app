const express = require("express");
const { protect } = require("../middlewares/auth"); // FIX: was '../middlewares/authMiddleware'
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
router.get("/", protect, getNotifications);
router.patch("/read-all", protect, markAllAsRead);
router.patch("/:id/read", protect, markAsRead);

module.exports = router;
