const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import configurations
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const activityRoutes = require('./routes/activityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const taskRoutes = require('../routes/tasks');

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects/:id/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
    console.log(`🔗 CORS enabled for ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});