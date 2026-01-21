'use strict';

const Organization = require('../models/organizationModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/envConfig');
const stripe = require('stripe')(config.STRIPE_SECRET_KEY);

// Custom error class for organization operations
class OrganizationControllerError extends Error {
  constructor(message, code, statusCode = 400) {
    super(message);
    this.name = 'OrganizationControllerError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Create a new organization (Platform operator only)
const createOrganization = async (req, res) => {
  try {
    const {
      name,
      domain,
      subscriptionTier,
      subscriptionStatus = 'active',
      maxUsers,
      features = [],
      settings = {}
    } = req.body;

    // Validate required fields
    if (!name || !domain || !subscriptionTier) {
      throw new OrganizationControllerError(
        'Name, domain, and subscriptionTier are required',
        'MISSING_REQUIRED_FIELDS',
        400
      );
    }

    // Validate subscription tier
    const validTiers = ['primary', 'high_school', 'university'];
    if (!validTiers.includes(subscriptionTier)) {
      throw new OrganizationControllerError(
        'Invalid subscription tier. Must be: primary, high_school, or university',
        'INVALID_SUBSCRIPTION_TIER',
        400
      );
    }

    // Check if domain is already taken
    const existingOrg = await Organization.findOne({ domain: domain.toLowerCase() });
    if (existingOrg) {
      throw new OrganizationControllerError(
        'Organization domain already exists',
        'DOMAIN_EXISTS',
        409
      );
    }

    // Set default maxUsers based on tier if not provided
    let defaultMaxUsers;
    switch (subscriptionTier) {
      case 'primary':
        defaultMaxUsers = 100;
        break;
      case 'high_school':
        defaultMaxUsers = 500;
        break;
      case 'university':
        defaultMaxUsers = 2000;
        break;
    }

    const finalMaxUsers = maxUsers || defaultMaxUsers;

    // Set default features based on tier
    let defaultFeatures;
    switch (subscriptionTier) {
      case 'primary':
        defaultFeatures = ['basic', 'attendance'];
        break;
      case 'high_school':
        defaultFeatures = ['standard', 'chat', 'attendance', 'exams', 'homework', 'analytics'];
        break;
      case 'university':
        defaultFeatures = ['premium', 'chat', 'attendance', 'exams', 'homework', 'analytics', 'reports', 'support'];
        break;
    }

    const finalFeatures = features.length > 0 ? features : defaultFeatures;

    // Create the organization
    const organization = new Organization({
      name: name.trim(),
      domain: domain.toLowerCase().trim(),
      subscriptionTier,
      subscriptionStatus,
      maxUsers: finalMaxUsers,
      features: finalFeatures,
      settings: {
        timezone: settings.timezone || 'UTC',
        currency: settings.currency || 'USD',
        language: settings.language || 'en',
        ...settings
      }
    });

    await organization.save();

    res.status(201).json({
      success: true,
      msg: 'Organization created successfully',
      organization: {
        id: organization._id,
        name: organization.name,
        domain: organization.domain,
        subscriptionTier: organization.subscriptionTier,
        subscriptionStatus: organization.subscriptionStatus,
        maxUsers: organization.maxUsers,
        features: organization.features,
        settings: organization.settings,
        createdAt: organization.createdAt
      }
    });

  } catch (error) {
    if (error instanceof OrganizationControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code
      });
    }

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        msg: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        msg: 'Organization domain already exists',
        code: 'DOMAIN_EXISTS'
      });
    }

    const wrappedError = new OrganizationControllerError(
      'Failed to create organization',
      'CREATE_ORGANIZATION_ERROR',
      500
    );
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code
    });
  }
};

// List all organizations (Platform operator only)
const listOrganizations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, tier } = req.query;

    const query = {};
    if (status) query.subscriptionStatus = status;
    if (tier) query.subscriptionTier = tier;

    const organizations = await Organization.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Organization.countDocuments(query);

    res.json({
      success: true,
      organizations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrganizations: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    const wrappedError = new OrganizationControllerError(
      'Failed to list organizations',
      'LIST_ORGANIZATIONS_ERROR',
      500
    );
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code
    });
  }
};

// Get organization details by ID
const getOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    // For organization users, they can only access their own organization
    // For platform operators, they can access any organization
    let organization;

    if (req.organization) {
      // User is accessing from within an organization context
      if (req.organization._id.toString() !== id) {
        throw new OrganizationControllerError(
          'Access denied: Can only access your own organization',
          'ACCESS_DENIED',
          403
        );
      }
      organization = req.organization;
    } else {
      // Platform operator accessing any organization
      organization = await Organization.findById(id);
    }

    if (!organization) {
      throw new OrganizationControllerError(
        'Organization not found',
        'ORGANIZATION_NOT_FOUND',
        404
      );
    }

    // Get user count for this organization
    const userCount = await User.countDocuments({ organizationId: organization._id });

    res.json({
      success: true,
      organization: {
        id: organization._id,
        name: organization.name,
        domain: organization.domain,
        subscriptionTier: organization.subscriptionTier,
        subscriptionStatus: organization.subscriptionStatus,
        maxUsers: organization.maxUsers,
        features: organization.features,
        settings: organization.settings,
        userCount,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt
      }
    });

  } catch (error) {
    if (error instanceof OrganizationControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code
      });
    }

    const wrappedError = new OrganizationControllerError(
      'Failed to get organization',
      'GET_ORGANIZATION_ERROR',
      500
    );
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code
    });
  }
};

// Update organization (Platform operator only)
const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;
    delete updates.domain; // Domain should not be changed after creation

    const organization = await Organization.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!organization) {
      throw new OrganizationControllerError(
        'Organization not found',
        'ORGANIZATION_NOT_FOUND',
        404
      );
    }

    res.json({
      success: true,
      msg: 'Organization updated successfully',
      organization
    });

  } catch (error) {
    if (error instanceof OrganizationControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code
      });
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        msg: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: validationErrors
      });
    }

    const wrappedError = new OrganizationControllerError(
      'Failed to update organization',
      'UPDATE_ORGANIZATION_ERROR',
      500
    );
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code
    });
  }
};

// Self-service organization signup with payment
const signupOrganization = async (req, res) => {
  let paymentIntent = null;
  let organization = null;
  let adminUser = null;
  let session = null;

  try {
    const {
      name,
      domain,
      subscriptionTier,
      admin,
      paymentMethodId
    } = req.body;

    // Validate required fields
    if (!name || !domain || !subscriptionTier || !admin) {
      throw new OrganizationControllerError(
        'Name, domain, subscriptionTier, and admin details are required',
        'MISSING_REQUIRED_FIELDS',
        400
      );
    }

    // Calculate payment amount
    const amount = config.SUBSCRIPTION_PRICES[subscriptionTier];
    
    // Payment method is required only for paid plans
    if (amount > 0 && !paymentMethodId) {
      throw new OrganizationControllerError(
        'Payment method is required for paid plans',
        'PAYMENT_METHOD_REQUIRED',
        400
      );
    }

    // Validate subscription tier
    const validTiers = ['primary', 'high_school', 'university'];
    if (!validTiers.includes(subscriptionTier)) {
      throw new OrganizationControllerError(
        'Invalid subscription tier. Must be: primary, high_school, or university',
        'INVALID_SUBSCRIPTION_TIER',
        400
      );
    }

    // Validate admin fields
    if (!admin.firstName || !admin.lastName || !admin.email || !admin.password || !admin.phoneNumber) {
      throw new OrganizationControllerError(
        'Admin first name, last name, email, password, and phone number are required',
        'MISSING_ADMIN_FIELDS',
        400
      );
    }

    // Validate domain format
    const domainRegex = /^[a-z0-9-]+$/;
    if (!domainRegex.test(domain.toLowerCase().trim())) {
      throw new OrganizationControllerError(
        'Domain can only contain lowercase letters, numbers, and hyphens',
        'INVALID_DOMAIN_FORMAT',
        400
      );
    }

    // Check if domain is already taken
    const existingOrg = await Organization.findOne({ domain: domain.toLowerCase() });
    if (existingOrg) {
      throw new OrganizationControllerError(
        'Organization domain already exists',
        'DOMAIN_EXISTS',
        409
      );
    }

    // Check if admin email already exists globally (across all organizations)
    const existingUser = await User.findOne({ email: admin.email.toLowerCase() });
    if (existingUser) {
      throw new OrganizationControllerError(
        'Email already registered',
        'EMAIL_EXISTS',
        409
      );
    }
    
    // Step 1: Process payment first (before creating anything)
    if (amount > 0) {
      try {
        // Create and confirm payment intent
        paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          payment_method: paymentMethodId,
          confirm: true,
          return_url: `${config.SERVER_BASE_URL || 'http://localhost:3000'}/signup-success`,
          metadata: {
            organization_name: name,
            organization_domain: domain.toLowerCase(),
            subscription_tier: subscriptionTier,
            admin_email: admin.email.toLowerCase()
          }
        });

        // Wait for payment to be confirmed (handle async confirmation)
        if (paymentIntent.status === 'requires_action') {
          // Payment requires additional authentication (3D Secure)
          throw new OrganizationControllerError(
            'Payment requires additional authentication. Please complete the authentication.',
            'PAYMENT_REQUIRES_ACTION',
            402
          );
        }

        // Check if payment was successful
        if (paymentIntent.status !== 'succeeded') {
          throw new OrganizationControllerError(
            `Payment failed: ${paymentIntent.status}`,
            'PAYMENT_FAILED',
            402
          );
        }
      } catch (stripeError) {
        // If it's our custom error, rethrow it
        if (stripeError instanceof OrganizationControllerError) {
          throw stripeError;
        }
        
        throw new OrganizationControllerError(
          `Payment processing failed: ${stripeError.message}`,
          'PAYMENT_ERROR',
          402
        );
      }
    }

    // Step 2: Create organization (within transaction if possible)
    try {
      // Set default maxUsers and features based on tier
      let defaultMaxUsers;
      let defaultFeatures;
      
      switch (subscriptionTier) {
        case 'primary':
          defaultMaxUsers = 100;
          defaultFeatures = ['attendance', 'exams', 'chat'];
          break;
        case 'high_school':
          defaultMaxUsers = 500;
          defaultFeatures = ['attendance', 'exams', 'chat', 'analytics', 'homework'];
          break;
        case 'university':
          defaultMaxUsers = 2000;
          defaultFeatures = ['attendance', 'exams', 'chat', 'analytics', 'homework', 'custom_branding', 'priority_support'];
          break;
      }

      organization = new Organization({
        name: name.trim(),
        domain: domain.toLowerCase().trim(),
        subscriptionTier,
        subscriptionStatus: 'active', // Auto-activate on successful payment
        maxUsers: defaultMaxUsers,
        features: defaultFeatures,
        settings: {
          timezone: 'UTC',
          currency: 'USD',
          language: 'en'
        }
      });

      await organization.save();
    } catch (orgError) {
      // If organization creation fails, refund payment
      if (paymentIntent && paymentIntent.status === 'succeeded' && amount > 0) {
        try {
          await stripe.refunds.create({
            payment_intent: paymentIntent.id
          });
        } catch (refundError) {
          console.error('Failed to refund payment after org creation failure:', refundError);
        }
      }
      throw orgError;
    }

    // Step 3: Create admin user
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(admin.password, salt);

      adminUser = await User.create({
        firstName: admin.firstName.trim(),
        lastName: admin.lastName.trim(),
        email: admin.email.toLowerCase().trim(),
        password: hash,
        phoneNumber: admin.phoneNumber.trim(),
        role: 'admin',
        organizationId: organization._id,
        isApproved: true
      });
    } catch (userError) {
      // If admin creation fails, delete organization and refund payment
      if (organization) {
        try {
          await Organization.findByIdAndDelete(organization._id);
        } catch (deleteError) {
          console.error('Failed to delete organization after admin creation failure:', deleteError);
        }
      }

      if (paymentIntent && paymentIntent.status === 'succeeded' && amount > 0) {
        try {
          await stripe.refunds.create({
            payment_intent: paymentIntent.id
          });
        } catch (refundError) {
          console.error('Failed to refund payment after admin creation failure:', refundError);
        }
      }
      throw userError;
    }

    // Step 4: Generate JWT token for auto-login
    const token = jwt.sign(
      { sub: adminUser._id.toString() },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Step 5: Return success response
    res.status(201).json({
      success: true,
      msg: 'Organization and admin account created successfully',
      token,
      organization: {
        id: organization._id,
        name: organization.name,
        domain: organization.domain,
        subscriptionTier: organization.subscriptionTier,
        subscriptionStatus: organization.subscriptionStatus,
        maxUsers: organization.maxUsers,
        features: organization.features
      },
      admin: {
        id: adminUser._id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        role: adminUser.role
      },
      paymentIntentId: paymentIntent ? paymentIntent.id : null
    });

  } catch (error) {
    // Final cleanup if anything goes wrong
    if (error instanceof OrganizationControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code
      });
    }

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      
      // Cleanup on validation error
      if (organization) {
        try {
          await Organization.findByIdAndDelete(organization._id);
        } catch (deleteError) {
          console.error('Failed to delete organization after validation error:', deleteError);
        }
      }

      if (paymentIntent && paymentIntent.status === 'succeeded' && config.SUBSCRIPTION_PRICES[req.body.subscriptionTier] > 0) {
        try {
          await stripe.refunds.create({
            payment_intent: paymentIntent.id
          });
        } catch (refundError) {
          console.error('Failed to refund payment after validation error:', refundError);
        }
      }

      return res.status(400).json({
        msg: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      // Cleanup on duplicate error
      if (organization) {
        try {
          await Organization.findByIdAndDelete(organization._id);
        } catch (deleteError) {
          console.error('Failed to delete organization after duplicate error:', deleteError);
        }
      }

      if (paymentIntent && paymentIntent.status === 'succeeded' && config.SUBSCRIPTION_PRICES[req.body.subscriptionTier] > 0) {
        try {
          await stripe.refunds.create({
            payment_intent: paymentIntent.id
          });
        } catch (refundError) {
          console.error('Failed to refund payment after duplicate error:', refundError);
        }
      }

      return res.status(409).json({
        msg: 'Organization domain or email already exists',
        code: 'DUPLICATE_ERROR'
      });
    }

    const wrappedError = new OrganizationControllerError(
      'Failed to create organization',
      'SIGNUP_ERROR',
      500
    );
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code
    });
  }
};

// Create payment intent (for frontend to get client secret)
const createPaymentIntent = async (req, res) => {
  try {
    const { subscriptionTier } = req.body;

    if (!subscriptionTier) {
      throw new OrganizationControllerError(
        'Subscription tier is required',
        'MISSING_TIER',
        400
      );
    }

    const validTiers = ['primary', 'high_school', 'university'];
    if (!validTiers.includes(subscriptionTier)) {
      throw new OrganizationControllerError(
        'Invalid subscription tier',
        'INVALID_TIER',
        400
      );
    }

    const amount = config.SUBSCRIPTION_PRICES[subscriptionTier];

    // If free tier, return success without creating payment intent
    if (amount === 0) {
      return res.json({
        success: true,
        clientSecret: null,
        amount: 0,
        isFree: true
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      isFree: false
    });

  } catch (error) {
    if (error instanceof OrganizationControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code
      });
    }

    const wrappedError = new OrganizationControllerError(
      'Failed to create payment intent',
      'PAYMENT_INTENT_ERROR',
      500
    );
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code
    });
  }
};

// Update subscription for existing organization (upgrade/downgrade)
const updateSubscription = async (req, res) => {
  try {
    if (!req.organization) {
      throw new OrganizationControllerError('Organization context required', 'NO_ORG_CONTEXT', 403);
    }

    const { subscriptionTier } = req.body;

    if (!subscriptionTier) {
      throw new OrganizationControllerError('Subscription tier is required', 'MISSING_TIER', 400);
    }

    const validTiers = ['primary', 'high_school', 'university'];
    if (!validTiers.includes(subscriptionTier)) {
      throw new OrganizationControllerError('Invalid subscription tier', 'INVALID_TIER', 400);
    }

    const currentTier = req.organization.subscriptionTier;
    const tierHierarchy = { primary: 0, high_school: 1, university: 2 };
    const isUpgrade = tierHierarchy[subscriptionTier] > tierHierarchy[currentTier];
    const isDowngrade = tierHierarchy[subscriptionTier] < tierHierarchy[currentTier];

    // For free tier changes (downgrades to primary), just update the organization
    if (subscriptionTier === 'primary') {
      const tierLimits = req.organization.getTierLimits();

      req.organization.subscriptionTier = subscriptionTier;
      req.organization.maxUsers = tierLimits.maxUsers;
      req.organization.features = tierLimits.features;
      req.organization.subscriptionStatus = 'active';

      await req.organization.save();

      return res.json({
        success: true,
        msg: 'Subscription updated successfully',
        organization: {
          subscriptionTier: req.organization.subscriptionTier,
          maxUsers: req.organization.maxUsers,
          features: req.organization.features,
          subscriptionStatus: req.organization.subscriptionStatus
        }
      });
    }

    // For paid plans, payment will be collected on frontend

    const amount = config.SUBSCRIPTION_PRICES[subscriptionTier];
    if (amount <= 0) {
      throw new OrganizationControllerError('Invalid plan pricing', 'INVALID_PRICING', 400);
    }

    // Create PaymentIntent (payment method will be attached on frontend)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        organization_id: req.organization._id.toString(),
        subscription_tier: subscriptionTier,
        action: isUpgrade ? 'upgrade' : 'change'
      }
    });

    // Return client secret for frontend to confirm payment
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount
    });

  } catch (error) {
    if (error instanceof OrganizationControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code
      });
    }

    const wrappedError = new OrganizationControllerError('Failed to update subscription', 'UPDATE_SUBSCRIPTION_ERROR', 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code
    });
  }
};

// Confirm subscription update after successful payment
const confirmSubscription = async (req, res) => {
  try {
    if (!req.organization) {
      throw new OrganizationControllerError('Organization context required', 'NO_ORG_CONTEXT', 403);
    }

    const { subscriptionTier, paymentIntentId } = req.body;

    if (!subscriptionTier || !paymentIntentId) {
      throw new OrganizationControllerError('Subscription tier and payment intent ID are required', 'MISSING_PARAMS', 400);
    }

    const validTiers = ['primary', 'high_school', 'university'];
    if (!validTiers.includes(subscriptionTier)) {
      throw new OrganizationControllerError('Invalid subscription tier', 'INVALID_TIER', 400);
    }

    // Verify payment intent belongs to this organization and was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.organization_id !== req.organization._id.toString()) {
      throw new OrganizationControllerError('Payment intent does not belong to this organization', 'INVALID_PAYMENT_INTENT', 403);
    }

    if (paymentIntent.status !== 'succeeded') {
      throw new OrganizationControllerError('Payment has not been completed successfully', 'PAYMENT_NOT_SUCCEEDED', 400);
    }

    // Update organization after successful payment
    const tierLimits = req.organization.getTierLimits();

    req.organization.subscriptionTier = subscriptionTier;
    req.organization.maxUsers = tierLimits.maxUsers;
    req.organization.features = tierLimits.features;
    req.organization.subscriptionStatus = 'active';

    await req.organization.save();

    res.json({
      success: true,
      msg: `Subscription updated successfully`,
      organization: {
        subscriptionTier: req.organization.subscriptionTier,
        maxUsers: req.organization.maxUsers,
        features: req.organization.features,
        subscriptionStatus: req.organization.subscriptionStatus
      }
    });

  } catch (error) {
    if (error instanceof OrganizationControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code
      });
    }

    const wrappedError = new OrganizationControllerError('Failed to confirm subscription', 'CONFIRM_SUBSCRIPTION_ERROR', 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code
    });
  }
};

// Search organizations by name or domain (Public API)
const searchOrganizations = async (req, res) => {
  try {
    const { q: searchQuery, limit = 10 } = req.query;

    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchRegex = new RegExp(searchQuery.trim(), 'i');

    const organizations = await Organization.find({
      $or: [
        { name: searchRegex },
        { domain: searchRegex }
      ],
      subscriptionStatus: 'active'
    })
    .select('name domain')
    .sort({ name: 1 })
    .limit(parseInt(limit, 10))
    .lean();

    const formattedOrganizations = organizations.map(org => ({
      id: org._id,
      name: org.name,
      domain: org.domain
    }));

    res.status(200).json({
      success: true,
      organizations: formattedOrganizations,
      count: formattedOrganizations.length,
      query: searchQuery.trim()
    });
  } catch (error) {
    console.error('Organization search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search organizations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc Find user organizations by email (for password reset)
// @params POST /api/v1/organizations/find-users
// @access Public
const findUserOrganizations = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new OrganizationControllerError("Email is required", "MISSING_EMAIL", 400);
    }

    // Find all approved users with this email across all organizations
    const users = await User.find({
      email: email.toLowerCase(),
      isApproved: true
    })
    .populate('organizationId', 'name domain')
    .select('organizationId role firstName lastName');

    if (users.length === 0) {
      return res.json({
        found: false,
        organizations: [],
        msg: "No accounts found with this email address."
      });
    }

    // Group by organization and get user roles
    const organizationsMap = new Map();

    users.forEach(user => {
      const orgId = user.organizationId._id.toString();
      if (!organizationsMap.has(orgId)) {
        organizationsMap.set(orgId, {
          id: user.organizationId._id,
          name: user.organizationId.name,
          domain: user.organizationId.domain,
          roles: []
        });
      }

      // Add role if not already present
      const org = organizationsMap.get(orgId);
      if (!org.roles.includes(user.role)) {
        org.roles.push(user.role);
      }
    });

    const organizations = Array.from(organizationsMap.values());

    res.json({
      found: true,
      organizations: organizations,
      count: organizations.length,
      msg: organizations.length === 1
        ? "Found your account in 1 organization."
        : `Found your account in ${organizations.length} organizations.`
    });

  } catch (error) {
    if (error instanceof OrganizationControllerError) {
      return res.status(error.statusCode).json({
        msg: error.message,
        code: error.code,
      });
    }

    const wrappedError = new OrganizationControllerError("Failed to search organizations", "SEARCH_ORGS_ERROR", 500);
    wrappedError.originalError = error;

    res.status(wrappedError.statusCode).json({
      msg: wrappedError.message,
      code: wrappedError.code,
    });
  }
};

module.exports = {
  createOrganization,
  listOrganizations,
  getOrganization,
  updateOrganization,
  signupOrganization,
  createPaymentIntent,
  updateSubscription,
  confirmSubscription,
  searchOrganizations,
  findUserOrganizations
};
