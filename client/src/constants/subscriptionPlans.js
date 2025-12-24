'use strict';

export const SUBSCRIPTION_PLANS = {
  primary: {
    id: 'primary',
    name: 'Primary School',
    displayName: 'Primary School',
    price: 0,
    priceDisplay: 'Free',
    billing: 'MONTHLY',
    maxUsers: 100,
    features: [
      'Up to 100 Users',
      '1 Admin Account',
      'Attendance Tracking',
      'Basic Support',
    ],
    featureCodes: ['basic', 'attendance'],
    buttonColor: '#14b8a6',
    buttonTextColor: '#ffffff',
    borderColor: '#14b8a6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    featured: false,
  },
  high_school: {
    id: 'high_school',
    name: 'High School',
    displayName: 'High School',
    price: 37.99,
    priceDisplay: '$37.99/month',
    billing: 'MONTHLY',
    maxUsers: 500,
    features: [
      'Up to 500 Users',
      '2 Admin Accounts',
      'Chat & Messaging',
      'Exams & Assessments',
      'Homework Management',
      'Analytics & Reports',
      'Priority Support',
    ],
    featureCodes: ['standard', 'chat', 'attendance', 'exams', 'homework', 'analytics'],
    buttonColor: '#ffffff',
    buttonTextColor: '#6415ff',
    borderColor: '#6415ff',
    backgroundColor: '#6415ff',
    textColor: '#ffffff',
    featured: true,
  },
  university: {
    id: 'university',
    name: 'University',
    displayName: 'University',
    price: 57.99,
    priceDisplay: '$57.99/month',
    billing: 'MONTHLY',
    maxUsers: 2000,
    features: [
      'Up to 2,000 Users',
      'Multiple Admin Accounts',
      'All Features Included',
      'Advanced Analytics',
      'Custom Reports',
      'Premium Support',
    ],
    featureCodes: ['premium', 'chat', 'attendance', 'exams', 'homework', 'analytics', 'reports', 'support'],
    buttonColor: '#ef4444',
    buttonTextColor: '#ffffff',
    borderColor: '#ef4444',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    featured: false,
  },
};

export const getPlanById = (planId) => {
  return SUBSCRIPTION_PLANS[planId] || null;
};

export const getPlanDisplayName = (planId) => {
  const plan = getPlanById(planId);
  return plan ? plan.displayName : planId;
};

export const getPlanMaxUsers = (planId) => {
  const plan = getPlanById(planId);
  return plan ? plan.maxUsers : 0;
};

export const getPlanFeatures = (planId) => {
  const plan = getPlanById(planId);
  return plan ? plan.features : [];
};

export const getPlanFeatureCodes = (planId) => {
  const plan = getPlanById(planId);
  return plan ? plan.featureCodes : [];
};

export const getAllPlans = () => {
  return Object.values(SUBSCRIPTION_PLANS);
};

export const PLAN_HIERARCHY = {
  primary: 0,
  high_school: 1,
  university: 2,
};

export const comparePlanLevels = (planA, planB) => {
  const levelA = PLAN_HIERARCHY[planA] || 0;
  const levelB = PLAN_HIERARCHY[planB] || 0;
  return levelA - levelB;
};

export const isUpgrade = (fromPlan, toPlan) => {
  return comparePlanLevels(toPlan, fromPlan) > 0;
};

export const isDowngrade = (fromPlan, toPlan) => {
  return comparePlanLevels(toPlan, fromPlan) < 0;
};
