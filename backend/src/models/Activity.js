const mongoose = require("mongoose");

/**
 * Activity model — Feature 9
 *
 * actionType values:
 *   task_created | task_deleted | task_status_changed
 *   member_added | member_removed | project_updated
 */
const activitySchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      enum: [
        "task_created",
        "task_deleted",
        "task_status_changed",
        "member_added",
        "member_removed",
        "project_updated",
      ],
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Extra context: task title, old/new status, member email…
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true } // createdAt = the timestamp shown in the feed
);

module.exports = mongoose.model("Activity", activitySchema);
