
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied, invalid token format" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token using secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded user info
    req.user = decoded; // decoded must contain { id: userId }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Access denied, token invalid" });
  }
};

module.exports = authMiddleware;
