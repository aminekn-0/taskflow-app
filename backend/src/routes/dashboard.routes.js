const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @route   GET /api/dashboard
// @desc    Get dashboard metrics for authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        const userProjects = await Project.find({
            $or: [{ owner: userId }, { members: userId }]
        }).select('_id');

        const projectIds = userProjects.map(p => p._id);

        // 1. Number of active projects
        const activeProjects = await Project.countDocuments({
            $or: [{ owner: userId }, { members: userId }],
            status: 'actif'
        });

        // 2. Number of tasks assigned to user
        const assignedTasks = await Task.countDocuments({
            assignedTo: userId,
            project: { $in: projectIds }
        });

        // 3. Number of completed tasks assigned to user
        const completedTasks = await Task.countDocuments({
            assignedTo: userId,
            status: 'done',             // FIX: was 'terminé'
            project: { $in: projectIds }
        });

        // 4. Number of overdue tasks (due date passed and not completed)
        const currentDate = new Date();
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            dueDate: { $lt: currentDate },  // FIX: was 'deadline'
            status: { $ne: 'done' },        // FIX: was 'terminé'
            project: { $in: projectIds }
        });

        // 5. Tasks in progress sorted by priority then due date
        const tasksInProgress = await Task.find({
            assignedTo: userId,
            status: 'in progress',      // FIX: was 'en cours'
            project: { $in: projectIds }
        })
        .populate('project', 'title')
        .sort({ dueDate: 1 })
        .limit(10);

        // 6. Aggregation pipeline metrics
        const aggregationMetrics = await Task.aggregate([
            {
                $match: {
                    assignedTo: userId,
                    project: { $in: projectIds }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAssigned: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }  // FIX: was 'terminé'
                    },
                    overdue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ['$dueDate', currentDate] },     // FIX: was '$deadline'
                                        { $ne: ['$status', 'done'] }            // FIX: was 'terminé'
                                    ]
                                },
                                1, 0
                            ]
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            activeProjects,
            assignedTasks,
            completedTasks,
            overdueTasks,
            tasksInProgress: tasksInProgress.map(task => ({
                id: task._id,
                title: task.title,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                deadline: task.dueDate,   // alias for frontend compatibility
                projectName: task.project?.title || 'Unknown Project'
            })),
            aggregationSummary: aggregationMetrics[0] || {
                totalAssigned: assignedTasks,
                completed: completedTasks,
                overdue: overdueTasks
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard data'
        });
    }
});

// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        const userProjects = await Project.find({
            $or: [{ owner: userId }, { members: userId }]
        }).select('_id');

        const projectIds = userProjects.map(p => p._id);

        const stats = await Task.aggregate([
            { $match: { assignedTo: userId, project: { $in: projectIds } } },
            {
                $facet: {
                    totalTasks: [{ $count: 'count' }],
                    completedTasks: [
                        { $match: { status: 'done' } },  // FIX: was 'terminé'
                        { $count: 'count' }
                    ],
                    overdueTasks: [
                        { $match: { dueDate: { $lt: new Date() }, status: { $ne: 'done' } } }, // FIX
                        { $count: 'count' }
                    ],
                    byPriority: [
                        { $group: { _id: '$priority', count: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        const activeProjectsCount = await Project.countDocuments({
            $or: [{ owner: userId }, { members: userId }],
            status: 'actif'
        });

        res.json({
            success: true,
            stats: {
                activeProjects: activeProjectsCount,
                totalTasks: stats[0].totalTasks[0]?.count || 0,
                completedTasks: stats[0].completedTasks[0]?.count || 0,
                overdueTasks: stats[0].overdueTasks[0]?.count || 0,
                tasksByPriority: stats[0].byPriority
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;  // FIX: was missing!
