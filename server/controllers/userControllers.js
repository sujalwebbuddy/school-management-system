const User = require("../models/userModel");
const Organization = require("../models/organizationModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const config = require("../config/envConfig");

class UserControllerError extends Error {
  constructor(message, code = "USER_ERROR", statusCode = 400) {
    super(message);
    this.name = "UserControllerError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password, organizationDomain } = req.body;

    if (!email || !password || !organizationDomain) {
      throw new UserControllerError("Email, password, and organization domain are required", "MISSING_FIELDS", 400);
    }

    const organization = await Organization.findOne({ domain: organizationDomain.toLowerCase() });

    if (!organization) {
      throw new UserControllerError("Organization not found", "ORG_NOT_FOUND", 404);
    }

    if (!organization.isActive()) {
      throw new UserControllerError("Organization subscription is inactive", "ORG_INACTIVE", 403);
    }

    const existUser = await User.findOne({
      email,
      organizationId: organization._id,
      isApproved: true
    }).select("+password");

    if (!existUser) {
      throw new UserControllerError("Invalid credentials or account not approved", "INVALID_CREDENTIALS", 401);
    }

    if (!existUser.password) {
      throw new UserControllerError("Account not properly set up", "ACCOUNT_NOT_SETUP", 401);
    }

    const verifyPassword = await bcrypt.compare(password, existUser.password);
    if (!verifyPassword) {
      throw new UserControllerError("Invalid password", "INVALID_PASSWORD", 401);
    }

    const userInfo = await User.findById(existUser._id)
      .select("-password")
      .populate("classIn")
      .populate("subject")
      .populate("organizationId", "name domain subscriptionTier subscriptionStatus maxUsers features");

    const token = jwt.sign(
      { sub: existUser._id },
      config.JWT_SECRET
    );

    // Get user count for this organization
    const userCount = await User.countDocuments({ organizationId: organization._id });

    res.json({
      success: true,
      token,
      userInfo,
      organization: {
        name: organization.name,
        domain: organization.domain,
        subscriptionTier: organization.subscriptionTier,
        subscriptionStatus: organization.subscriptionStatus,
        maxUsers: organization.maxUsers,
        features: organization.features,
        userCount: userCount
      }
    });
  } catch (error) {
    if (error instanceof UserControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new UserControllerError("Login failed", "LOGIN_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, role, phoneNumber, organizationDomain } = req.body;

    if (!firstName || !lastName || !email || !role || !phoneNumber || !organizationDomain) {
      throw new UserControllerError("All fields including organization domain are required", "MISSING_FIELDS", 400);
    }

    if (!["teacher", "student"].includes(role)) {
      throw new UserControllerError("Invalid role specified", "INVALID_ROLE", 400);
    }

    const organization = await Organization.findOne({ domain: organizationDomain.toLowerCase() });

    if (!organization) {
      throw new UserControllerError("Organization not found", "ORG_NOT_FOUND", 404);
    }

    if (!organization.isActive()) {
      throw new UserControllerError("Organization subscription is inactive", "ORG_INACTIVE", 403);
    }

    // Check user limit for the organization
    const currentUserCount = await User.countDocuments({
      organizationId: organization._id,
      isApproved: true
    });

    if (currentUserCount >= organization.maxUsers) {
      throw new UserControllerError(
        `User limit reached. Your ${organization.subscriptionTier.replace('_', ' ')} plan allows maximum ${organization.maxUsers} users. Please upgrade your plan to add more users.`,
        "USER_LIMIT_EXCEEDED",
        403
      );
    }

    const existingUser = await User.findOne({
      email,
      organizationId: organization._id
    });

    if (existingUser) {
      if (existingUser.isApproved) {
        throw new UserControllerError("Email already registered for this organization", "EMAIL_EXISTS", 409);
      } else {
        throw new UserControllerError("Registration request already pending for this organization", "PENDING_APPROVAL", 409);
      }
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      role,
      phoneNumber,
      organizationId: organization._id,
      isApproved: false,
    });

    res.json({
      msg: "Registration request sent successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        organization: organization.name
      }
    });
  } catch (error) {
    if (error instanceof UserControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new UserControllerError("Registration failed", "REGISTRATION_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.getUserData = async (req, res) => {
  try {
    if (!req.user) {
      throw new UserControllerError("User not authenticated", "NOT_AUTHENTICATED", 401);
    }

    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("classIn")
      .populate("subject")
      .populate("organizationId", "name domain subscriptionTier subscriptionStatus maxUsers features");

    if (!user) {
      throw new UserControllerError("User not found", "USER_NOT_FOUND", 404);
    }

    // Get user count for this organization
    const userCount = await User.countDocuments({ organizationId: user.organizationId._id });

    res.json({
      user,
      organization: {
        name: user.organizationId.name,
        domain: user.organizationId.domain,
        subscriptionTier: user.organizationId.subscriptionTier,
        subscriptionStatus: user.organizationId.subscriptionStatus,
        maxUsers: user.organizationId.maxUsers,
        features: user.organizationId.features,
        userCount: userCount
      }
    });
  } catch (error) {
    if (error instanceof UserControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new UserControllerError("Failed to retrieve user data", "GET_USER_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

exports.getActiveOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({
      subscriptionStatus: "active"
    })
    .select("name domain subscriptionTier")
    .sort({ name: 1 });

    res.json({
      success: true,
      organizations: organizations.map(org => ({
        name: org.name,
        domain: org.domain,
        tier: org.subscriptionTier
      }))
    });
  } catch (error) {
    const wrappedError = new UserControllerError("Failed to retrieve organizations", "GET_ORGS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};
