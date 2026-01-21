const express = require('express');
const {
  createOrganization,
  listOrganizations,
  getOrganization,
  updateOrganization,
  signupOrganization,
  createPaymentIntent,
  updateSubscription,
  confirmSubscription,
  findUserOrganizations
} = require('../controllers/organizationController');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public routes (self-service signup)
router.post('/signup', signupOrganization);
router.post('/create-payment-intent', createPaymentIntent);

// Public organization search and user lookup
router.get('/search', require('../controllers/organizationController').searchOrganizations);
router.post('/find-users', findUserOrganizations);

// Organization admin routes (tenant protected)
router.post('/update-subscription', authMiddleware, tenantMiddleware, roleMiddleware('admin'), updateSubscription);
router.post('/confirm-subscription', authMiddleware, tenantMiddleware, roleMiddleware('admin'), confirmSubscription);

// Platform operator only routes (auth required, no tenant middleware)
router.post('/createOrganization', authMiddleware, createOrganization);
router.get('/listOrganizations', authMiddleware, listOrganizations);
router.get('/:id', authMiddleware, getOrganization);
router.put('/:id', authMiddleware, updateOrganization);

module.exports = router;