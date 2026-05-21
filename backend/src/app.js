const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/project.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// routes
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects/:id/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;
