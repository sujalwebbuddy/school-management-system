class FeatureError extends Error {
  constructor(message, code = "FEATURE_ERROR", statusCode = 403) {
    super(message);
    this.name = "FeatureError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

const requireFeature = (featureName) => {
  return (req, res, next) => {
    try {
      if (!req.organization) {
        throw new FeatureError("Organization context required", "ORG_CONTEXT_MISSING", 500);
      }

      if (!req.organization.isFeatureEnabled(featureName)) {
        throw new FeatureError(
          `The '${featureName}' feature is not available in your current subscription plan. Please upgrade to access this feature.`,
          "FEATURE_NOT_AVAILABLE",
          403
        );
      }

      next();
    } catch (error) {
      if (error instanceof FeatureError) {
        return res.status(error.statusCode).json({
          msg: error.message,
          code: error.code,
          requiredFeature: featureName,
        });
      }

      const wrappedError = new FeatureError(
        "Feature validation failed",
        "FEATURE_VALIDATION_ERROR",
        500
      );
      wrappedError.originalError = error;

      res.status(wrappedError.statusCode).json({
        msg: wrappedError.message,
        code: wrappedError.code,
      });
    }
  };
};

module.exports = { requireFeature, FeatureError };
