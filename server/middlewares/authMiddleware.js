const jwt = require("jsonwebtoken");
const config = require("../config/envConfig");
const User = require("../models/userModel");

class AdminError extends Error {
  constructor(message, code = "ADMIN_ACCESS_DENIED", statusCode = 403) {
    super(message);
    this.name = "AdminError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

const adminMiddleware = async (req, res, next) => {
  try {
    // Ensure tenant middleware has run and organization context exists
    if (!req.organization) {
      throw new AdminError("Organization context required", "NO_ORG_CONTEXT", 403);
    }

    // Check if user is an admin
    const currentUser = await User.findOne({
      _id: req.userId,
      organizationId: req.organization._id
    });

    if (!currentUser) {
      throw new AdminError("User not found in your organization", "USER_NOT_FOUND", 404);
    }

    if (currentUser.role !== "admin") {
      throw new AdminError("Admin access required", "ADMIN_ACCESS_DENIED", 403);
    }

    // User is admin, proceed
    next();
  } catch (error) {
    if (error instanceof AdminError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new AdminError("Admin verification failed", "ADMIN_VERIFICATION_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

class AuthError extends Error {
  constructor(message, code = "AUTH_ERROR", statusCode = 401) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("token");

    if (!token) {
      throw new AuthError("Authorization token required", "TOKEN_MISSING", 401);
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    if (!decodedToken.sub) {
      throw new AuthError("Invalid token format", "INVALID_TOKEN", 401);
    }

    req.userId = decodedToken.sub;

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      throw new AuthError("User not found", "USER_NOT_FOUND", 401);
    }

    if (!user.isApproved) {
      throw new AuthError("Account not approved", "ACCOUNT_NOT_APPROVED", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        msg: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        msg: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    const wrappedError = new AuthError("Authentication failed", "AUTH_FAILED", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
