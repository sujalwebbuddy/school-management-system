const express = require('express');
const {
  createOrganization,
  listOrganizations,
  getOrganization,
  updateOrganization,
  signupOrganization,
  createPaymentIntent,
  updateSubscription,
  confirmSubscription
} = require('../controllers/organizationController');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes (self-service signup)
router.post('/signup', signupOrganization);
router.post('/create-payment-intent', createPaymentIntent);

// Public organization search
router.get('/search', require('../controllers/organizationController').searchOrganizations);

// Organization admin routes (tenant protected)
router.post('/update-subscription', authMiddleware, tenantMiddleware, adminMiddleware, updateSubscription);
router.post('/confirm-subscription', authMiddleware, tenantMiddleware, adminMiddleware, confirmSubscription);

// Platform operator only routes (auth required, no tenant middleware)
router.post('/createOrganization', authMiddleware, createOrganization);
router.get('/listOrganizations', authMiddleware, listOrganizations);
router.get('/:id', authMiddleware, getOrganization);
router.put('/:id', authMiddleware, updateOrganization);

module.exports = router;