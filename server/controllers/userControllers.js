const User = require("../models/userModel");
const Organization = require("../models/organizationModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/envConfig");
const { sendPasswordResetEmail } = require("../utils/mailUtils");

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
      .populate([
        "classIn",
        "subject"
      ]);

    const token = jwt.sign(
      { sub: existUser._id },
      config.JWT_SECRET
    );

    // Get user count for this organization
    const userCount = await User.countDocuments({ organizationId: organization._id });

    res.json({
      success: true,
      token,
      userInfo: userInfo.toObject(),
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
      .populate([
        "classIn",
        "subject"
      ]);

    if (!user) {
      throw new UserControllerError("User not found", "USER_NOT_FOUND", 404);
    }

    // Get organization data
    const organization = await Organization.findById(user.organizationId);

    if (!organization) {
      throw new UserControllerError("Organization not found", "ORG_NOT_FOUND", 404);
    }

    // Get user count for this organization
    const userCount = await User.countDocuments({ organizationId: organization._id });

    res.json({
      user: user.toObject(),
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



// @desc Request password reset (updated to be organization-aware)
// @params POST /api/v1/auth/forgot-password
// @access Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email, organizationDomain } = req.body;

    if (!email) {
      throw new UserControllerError("Email is required", "MISSING_EMAIL", 400);
    }

    // If organization domain is not provided, find user's organizations first
    if (!organizationDomain) {
      const users = await User.find({
        email: email.toLowerCase(),
        isApproved: true
      })
      .populate('organizationId', 'name domain')
      .select('organizationId');

      if (users.length === 0) {
        return res.json({
          requiresOrganization: false,
          msg: "If an account with that email exists, a password reset link has been sent."
        });
      }

      if (users.length === 1) {
        // Only one organization, proceed with that one
        return await sendPasswordResetEmailHelper(users[0].organizationId, email, res);
      } else {
        // Multiple organizations, user needs to choose
        const organizations = users.map(user => ({
          id: user.organizationId._id,
          name: user.organizationId.name,
          domain: user.organizationId.domain
        }));

        return res.json({
          requiresOrganization: true,
          organizations: organizations,
          msg: `Found accounts in ${organizations.length} organizations. Please select your organization.`
        });
      }
    }

    // Organization domain provided, proceed with specific organization
    const organization = await Organization.findOne({
      domain: organizationDomain.toLowerCase(),
      isActive: true
    });

    if (!organization) {
      throw new UserControllerError("Organization not found or inactive", "ORG_NOT_FOUND", 404);
    }

    return await sendPasswordResetEmailHelper(organization, email, res);

  } catch (error) {
    if (error instanceof UserControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new UserControllerError("Failed to process password reset request", "FORGOT_PASSWORD_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

// Helper function to send password reset email
const sendPasswordResetEmailHelper = async (organization, email, res) => {
  try {
    // Find user in the specific organization
    const user = await User.findOne({
      email: email.toLowerCase(),
      organizationId: organization._id,
      isApproved: true
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        msg: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiry (1 hour from now)
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Send email using mail utility
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, `${user.firstName} ${user.lastName}`, resetUrl);

    res.json({
      msg: "If an account with that email exists, a password reset link has been sent."
    });

  } catch (error) {
    throw error; // Re-throw to be handled by caller
  }
};

// @desc Verify password reset token
// @params POST /api/v1/auth/verify-reset-token
// @access Public
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new UserControllerError("Reset token is required", "MISSING_TOKEN", 400);
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new UserControllerError("Invalid or expired reset token", "INVALID_TOKEN", 400);
    }

    res.json({
      msg: "Token is valid",
      valid: true,
      email: user.email
    });

  } catch (error) {
    if (error instanceof UserControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
        valid: false
      });
    }

    const wrappedError = new UserControllerError("Failed to verify reset token", "VERIFY_TOKEN_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
      valid: false
    });
  }
};

// @desc Reset password with token
// @params POST /api/v1/auth/reset-password
// @access Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new UserControllerError("Reset token and new password are required", "MISSING_FIELDS", 400);
    }

    if (newPassword.length < 6) {
      throw new UserControllerError("Password must be at least 6 characters long", "PASSWORD_TOO_SHORT", 400);
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new UserControllerError("Invalid or expired reset token", "INVALID_TOKEN", 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      msg: "Password has been reset successfully"
    });

  } catch (error) {
    if (error instanceof UserControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new UserControllerError("Failed to reset password", "RESET_PASSWORD_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

// @desc Change user password
// @params PUT /api/v1/auth/change-password
// @access Private (authenticated users only)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId || req.headers.userid;

    if (!currentPassword || !newPassword) {
      throw new UserControllerError("Current password and new password are required", "MISSING_FIELDS", 400);
    }

    if (newPassword.length < 6) {
      throw new UserControllerError("New password must be at least 6 characters long", "PASSWORD_TOO_SHORT", 400);
    }

    // Find user
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new UserControllerError("User not found", "USER_NOT_FOUND", 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UserControllerError("Current password is incorrect", "INVALID_CURRENT_PASSWORD", 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({
      msg: "Password changed successfully"
    });

  } catch (error) {
    if (error instanceof UserControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new UserControllerError("Failed to change password", "CHANGE_PASSWORD_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};
