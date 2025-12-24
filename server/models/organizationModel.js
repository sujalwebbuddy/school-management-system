const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: function (v) {
          return /^[a-z0-9-]+$/g.test(v);
        },
        message: "Domain must contain only lowercase letters, numbers, and hyphens",
      },
    },
    subscriptionTier: {
      type: String,
      required: true,
      enum: ["primary", "high_school", "university"],
      index: true,
    },
    subscriptionStatus: {
      type: String,
      required: true,
      enum: ["active", "inactive", "trial"],
      default: "trial",
      index: true,
    },
    maxUsers: {
      type: Number,
      required: true,
      min: 1,
      max: 10000,
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          const validFeatures = [
            "basic",
            "standard",
            "premium",
            "chat",
            "attendance",
            "exams",
            "homework",
            "analytics",
            "reports",
            "support"
          ];
          return v.every(feature => validFeatures.includes(feature));
        },
        message: "Invalid feature specified",
      },
    },
    settings: {
      timezone: {
        type: String,
        default: "UTC",
      },
      currency: {
        type: String,
        default: "USD",
      },
      language: {
        type: String,
        default: "en",
      },
    },
  },
  {
    timestamps: true,
  }
);

organizationSchema.index({ subscriptionTier: 1, subscriptionStatus: 1 });
organizationSchema.index({ createdAt: -1 });

organizationSchema.methods.getTierLimits = function () {
  const tierLimits = {
    primary: {
      maxUsers: 100,
      features: ["basic", "attendance"],
    },
    high_school: {
      maxUsers: 500,
      features: ["standard", "chat", "attendance", "exams", "homework", "analytics"],
    },
    university: {
      maxUsers: 2000,
      features: ["premium", "chat", "attendance", "exams", "homework", "analytics", "reports", "support"],
    },
  };

  return tierLimits[this.subscriptionTier] || tierLimits.primary;
};

organizationSchema.methods.isFeatureEnabled = function (feature) {
  return this.features.includes(feature);
};

organizationSchema.methods.canAddUsers = function (currentUserCount) {
  return currentUserCount < this.maxUsers;
};

organizationSchema.methods.isActive = function () {
  return this.subscriptionStatus === "active";
};

organizationSchema.pre("save", function (next) {
  if (this.isNew) {
    const tierLimits = this.getTierLimits();
    this.maxUsers = tierLimits.maxUsers;
    this.features = tierLimits.features;
  }
  next();
});

module.exports = mongoose.model("Organization", organizationSchema);