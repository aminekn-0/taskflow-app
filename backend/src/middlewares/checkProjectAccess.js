const Project = require('../models/Project');

const checkProjectAccess = (requiredRole = 'member') => {
    return async (req, res, next) => {
        try {
            const project = await Project.findById(req.params.projectId);
            if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

            const isOwner = project.owner.toString() === req.user.id;
            const isMember = project.members.some(m => m.toString() === req.user.id);

            if (requiredRole === 'owner' && !isOwner) {
                return res.status(403).json({ message: 'Action réservée au créateur' });
            }

            if (requiredRole === 'member' && !isOwner && !isMember) {
                return res.status(403).json({ message: 'Accès non autorisé' });
            }

            req.project = project;
            req.isOwner = isOwner;
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};

module.exports = checkProjectAccess;