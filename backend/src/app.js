const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/project.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// routes
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
