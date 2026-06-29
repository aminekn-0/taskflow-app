const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Le titre est obligatoire"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "La priorité est obligatoire"],
        },
        status: {
            type: String,
            enum: ["todo", "in progress", "done"],
            default: "todo",
        },
        dueDate: {
            type: Date,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Le projet parent est obligatoire"],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);