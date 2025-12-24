'use strict';

const User = require("../models/userModel");
const Organization = require("../models/organizationModel");

// Lazy load config to avoid environment variable issues during testing
let config = null;
try {
  config = require("../config/envConfig");
} catch (error) {
  // Config not available during testing
}

// ============================================================================
// ANALYTICS CONSTANTS
// ============================================================================

const ANALYTICS_CONSTANTS = {
  DEFAULT_DAYS: 30,
  RECENT_ACTIVITY_DAYS: 7,
  ATTENDANCE_DAYS: 30,
  RECENT_ORGANIZATIONS_LIMIT: 5,
  RECENT_ACTIVITY_LIMIT: 10,
  MAX_DAYS_LIMIT: 365,
  MIN_DAYS_LIMIT: 1
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ============================================================================
// ANALYTICS HELPER FUNCTIONS
// ============================================================================

/**
 * Validates and sanitizes days parameter for analytics queries
 * @param {string|number} days - Days parameter from query
 * @returns {number} Validated days value
 */
const validateDaysParameter = (days) => {
  const parsedDays = parseInt(days, 10);
  if (isNaN(parsedDays) ||
      parsedDays < ANALYTICS_CONSTANTS.MIN_DAYS_LIMIT ||
      parsedDays > ANALYTICS_CONSTANTS.MAX_DAYS_LIMIT) {
    return ANALYTICS_CONSTANTS.DEFAULT_DAYS;
  }
  return parsedDays;
};

/**
 * Creates date range for analytics queries
 * @param {number} days - Number of days back from today
 * @returns {Object} Object with startDate and endDate
 */
const createDateRange = (days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDate, endDate };
};

/**
 * Generates complete date series with zero-fill for missing dates
 * @param {Array} data - Array of date-value objects
 * @param {Date} startDate - Start date for the series
 * @param {Date} endDate - End date for the series
 * @param {string} dateKey - Key for date in data objects
 * @param {string} valueKey - Key for value in data objects
 * @returns {Array} Complete date series with zero-fill
 */
const fillMissingDates = (data, startDate, endDate, dateKey = '_id', valueKey = 'count') => {
  const dataMap = new Map(data.map(item => [item[dateKey], item[valueKey]]));
  const result = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      registrations: dataMap.get(dateStr) || 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

/**
 * Calculates organization metrics from organization data
 * @param {Array} organizations - Array of organization objects
 * @param {Object} subscriptionPrices - Subscription pricing configuration
 * @returns {Object} Calculated metrics
 */
const calculateOrganizationMetrics = (organizations, subscriptionPrices = {}) => {
  const tierDistribution = {};
  let totalRevenue = 0;
  let activeSubscriptions = 0;
  let totalUserCapacity = 0;

  organizations.forEach(org => {
    const tier = org.subscriptionTier || 'primary';
    tierDistribution[tier] = (tierDistribution[tier] || 0) + 1;

    if (org.subscriptionStatus === 'active') {
      activeSubscriptions++;
      totalUserCapacity += org.maxUsers;

      if (tier !== 'primary' && subscriptionPrices[tier]) {
        totalRevenue += subscriptionPrices[tier];
      }
    }
  });

  return {
    tierDistribution,
    totalOrganizations: organizations.length,
    activeSubscriptions,
    totalRevenue,
    totalUserCapacity
  };
};

/**
 * Gets user counts for organization
 * @param {ObjectId} organizationId - Organization ID
 * @returns {Object} User count metrics
 */
const getUserCounts = async (organizationId) => {
  const [totalUsers, activeUsers] = await Promise.all([
    User.countDocuments({ organizationId, isApproved: true }),
    User.countDocuments({
      organizationId,
      isApproved: true,
      lastLogin: { $gte: new Date(Date.now() - ANALYTICS_CONSTANTS.RECENT_ACTIVITY_DAYS * MS_PER_DAY) }
    })
  ]);

  return { totalUsers, activeUsers };
};

/**
 * Handles analytics errors consistently
 * @param {Error} error - Error object
 * @param {string} operation - Operation name for logging
 * @param {Response} res - Express response object
 */
const handleAnalyticsError = (error, operation, res) => {
  console.error(`Analytics error in ${operation}:`, error);
  res.status(500).json({
    success: false,
    message: 'Failed to retrieve analytics data',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  ANALYTICS_CONSTANTS,
  MS_PER_DAY,
  validateDaysParameter,
  createDateRange,
  fillMissingDates,
  calculateOrganizationMetrics,
  getUserCounts,
  handleAnalyticsError
};
