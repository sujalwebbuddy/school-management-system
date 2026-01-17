const User = require("../models/userModel");

class RoleError extends Error {
  constructor(message, code = "ROLE_ACCESS_DENIED", statusCode = 403) {
    super(message);
    this.name = "RoleError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.organization) {
        throw new RoleError("Organization context required", "NO_ORG_CONTEXT", 403);
      }

      const currentUser = await User.findOne({
        _id: req.userId,
        organizationId: req.organization._id
      });

      if (!currentUser) {
        throw new RoleError("User not found in your organization", "USER_NOT_FOUND", 404);
      }

      const rolesArray = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;

      if (!rolesArray.includes(currentUser.role)) {
        throw new RoleError(
          `Access denied. Required roles: ${rolesArray.join(', ')}`,
          "ROLE_ACCESS_DENIED",
          403
        );
      }

      next();
    } catch (error) {
      if (error instanceof RoleError) {
        return res.status(error.statusCode).json({
          msg: error.message,
          code: error.code,
        });
      }

      const wrappedError = new RoleError("Role verification failed", "ROLE_VERIFICATION_ERROR", 500);
      wrappedError.originalError = error;

      res.status(wrappedError.statusCode).json({
        msg: wrappedError.message,
        code: wrappedError.code,
      });
    }
  };
};

module.exports = roleMiddleware;
