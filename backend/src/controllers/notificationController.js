const Notification = require("../models/Notification");

/**
 * createNotification — call this whenever a user should be notified.
 * Never throws: must not crash the main request.
 *
 * @param {string} userId    - recipient user ObjectId
 * @param {string} type      - 'task_assigned' | 'task_status_changed' | 'member_added'
 * @param {string} message   - human-readable message (French)
 * @param {string} projectId - optional project reference
 */
const createNotification = async (userId, type, message, projectId = null) => {
  try {
    await Notification.create({ user: userId, type, message, project: projectId });
  } catch (err) {
    console.error("⚠️  Notification creation failed:", err.message);
  }
};

/**
 * GET /api/notifications
 * Returns all notifications for the logged-in user, newest first.
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read.
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/notifications/read-all
 * Marks every unread notification as read for the logged-in user.
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );
    res.json({ message: "Toutes les notifications marquées comme lues" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNotification, getNotifications, markAsRead, markAllAsRead };
