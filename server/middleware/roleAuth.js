const User = require("../models/User");

const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      // Check if user exists in request (from auth middleware)
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get user from database to check role
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if user has required role
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: `Access denied. Required role: ${roles.join(" or ")}`,
        });
      }

      // Add user object to request for use in route handlers
      req.userObj = user;
      next();
    } catch (error) {
      console.error("Role auth error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = requireRole;
