const Activity = require("../models/Activity");

/**
 * logActivity — call this after every significant action.
 * Never throws: logging must never crash the main request.
 *
 * @param {string} actionType  - one of the Activity enum values
 * @param {string} projectId   - ObjectId of the project
 * @param {string} userId      - ObjectId of the acting user
 * @param {object} meta        - optional extra info (taskTitle, oldStatus…)
 */
const logActivity = async (actionType, projectId, userId, meta = {}) => {
  try {
    await Activity.create({ actionType, project: projectId, user: userId, meta });
  } catch (err) {
    console.error("⚠️  Activity logging failed:", err.message);
  }
};

/**
 * GET /api/projects/:id/activities
 * Returns all activities for a project, newest first.
 */
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "fullName email") // show who did the action — no password
      .lean();

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logActivity, getActivities };
