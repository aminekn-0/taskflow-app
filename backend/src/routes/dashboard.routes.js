const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getDashboard } = require("../controllers/dashboard.controller");

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        // Your dashboard aggregation logic here...
        res.json({ metrics: { ...} });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;