const Organization = require("../models/organizationModel");

class TenantError extends Error {
  constructor(message, code = "TENANT_ERROR", statusCode = 403) {
    super(message);
    this.name = "TenantError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

const tenantMiddleware = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new TenantError("Authentication required", "AUTH_REQUIRED", 401);
    }

    if (!req.user || !req.user.organizationId) {
      throw new TenantError("User organization not found", "ORG_NOT_FOUND", 403);
    }

    const organization = await Organization.findById(req.user.organizationId);

    if (!organization) {
      throw new TenantError("Organization not found", "ORG_NOT_FOUND", 403);
    }

    if (!organization.isActive()) {
      throw new TenantError("Organization subscription is inactive", "ORG_INACTIVE", 403);
    }

    req.organization = organization;
    next();
  } catch (error) {
    if (error instanceof TenantError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new TenantError(
      "Tenant validation failed",
      "TENANT_VALIDATION_ERROR",
      500
    );
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

module.exports = tenantMiddleware;