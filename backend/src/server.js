const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes        = require('./routes/auth');
const dashboardRoutes   = require('./routes/dashboard.routes');   // FIX: was './routes/dashboard'
const projectRoutes     = require('./routes/project.routes');
const activityRoutes    = require('./routes/activityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const projectMemberRoutes = require('./routes/projectMembers');
const taskRoutes        = require('./routes/tasks.routes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Mount routes
app.use('/api/auth',          authRoutes);
app.use('/api/dashboard',     dashboardRoutes);
app.use('/api/projects',      projectRoutes);
app.use('/api/projects/:id/activities', activityRoutes); // mergeParams exposes :id inside
app.use('/api/notifications', notificationRoutes);
app.use('/api',               projectMemberRoutes);  // handles /api/projects/:projectId/members
app.use('/api',               taskRoutes);           // handles /api/tasks and /api/projects/:id/tasks

// Root health-check
app.get('/', (req, res) => {
    res.json({ message: 'TaskFlow API is running' });
});

// Connect to MongoDB then start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});