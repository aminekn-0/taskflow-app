const express = require("express");

const projectRoutes = require("./routes/projectRoutes");

const activityRoutes = require("./routes/activityRoutes");

const app = express();

app.use(express.json());

// routes
app.use("/api/projects", projectRoutes);

module.exports = app;
