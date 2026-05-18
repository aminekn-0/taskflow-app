const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middlewares/auth');

// Helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters',
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Create user (password will be hashed by schema pre-save hook)
        const user = await User.create({
            fullName,
            email,
            password,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                name: user.fullName, // For dashboard compatibility
                email: user.email,
            },
            redirectTo: '/dashboard',
            message: 'User created successfully',
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Check if user exists and get password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                name: user.fullName, // For dashboard compatibility
                email: user.email,
            },
            redirectTo: '/dashboard',
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                fullName: req.user.fullName,
                name: req.user.fullName,
                email: req.user.email,
            },
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});

// @route   GET /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private
router.get('/verify-token', protect, async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Token is valid',
        user: {
            id: req.user._id,
            fullName: req.user.fullName,
            name: req.user.fullName,
            email: req.user.email,
        },
    });
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side only, but endpoint for completeness)
// @access  Private
router.post('/logout', protect, async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});

module.exports = router;