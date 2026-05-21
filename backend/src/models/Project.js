const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, required: true },

    deadline: { type: Date },

    status: {
      type: String,
      enum: ["actif", "en pause", "archivé"],
      default: "actif"
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // FIX: members field was missing — referenced throughout the codebase
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  { timestamps: true }
);

/**
 * Cascade delete tasks when project deleted
 */
projectSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const Task = require("./Task");
  await Task.deleteMany({ project: this._id });
  next();
});

module.exports = mongoose.model("Project", projectSchema);
