const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth.middleware'); // FIX: was '../middleware/auth'

// Invite member by email (owner only)
router.post('/projects/:projectId/members', authMiddleware, async (req, res) => {
    try {
        const { email } = req.body;
        const project = await Project.findById(req.params.projectId);

        if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Seul le créateur peut inviter des membres' });
        }

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) return res.status(404).json({ message: 'Aucun compte avec cet email' });
        if (project.members.includes(userToAdd._id)) {
            return res.status(400).json({ message: 'Déjà membre du projet' });
        }
        if (project.owner.toString() === userToAdd._id.toString()) {
            return res.status(400).json({ message: 'Le créateur est déjà propriétaire' });
        }

        project.members.push(userToAdd._id);
        await project.save();

        await project.populate('members', 'fullName email');
        res.status(200).json({ message: 'Membre ajouté', members: project.members });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove member (owner only)
router.delete('/projects/:projectId/members/:memberId', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Seul le créateur peut retirer des membres' });
        }

        project.members = project.members.filter(m => m.toString() !== req.params.memberId);
        await project.save();
        await project.populate('members', 'fullName email');
        res.status(200).json({ message: 'Membre retiré', members: project.members });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get project members (any authenticated user in project)
router.get('/projects/:projectId/members', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId)
            .populate('owner', 'fullName email')
            .populate('members', 'fullName email');

        if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

        const isMember = project.members.some(m => m._id.toString() === req.user.id) ||
            project.owner._id.toString() === req.user.id;
        if (!isMember) return res.status(403).json({ message: 'Non autorisé' });

        res.json({
            owner: project.owner,
            members: project.members
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;