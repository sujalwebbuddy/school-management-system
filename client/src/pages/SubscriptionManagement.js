'use strict';

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Check as CheckIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../utils/api';
import { getAllPlans, getPlanById } from '../constants/subscriptionPlans';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...');

// Use plans from constants
const plans = getAllPlans();

// Payment Form Component
const PaymentForm = ({ onSubmit, onConfirmPayment, loading, selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalError(null);

    if (!stripe || !elements) {
      setLocalError('Stripe is not loaded. Please refresh the page.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLocalError('Card element not found.');
      return;
    }

    try {
      // Get client secret from backend first
      const result = await onSubmit();

      if (result && result.clientSecret) {
        // Confirm the payment with the client secret
        // This will automatically attach the payment method and confirm
        const { error: confirmError } = await stripe.confirmCardPayment(result.clientSecret, {
          payment_method: {
            card: cardElement,
          }
        });

        if (confirmError) {
          setLocalError(confirmError.message);
          return;
        }

        // Payment successful - call onConfirmPayment with payment intent ID
        if (onConfirmPayment) {
          onConfirmPayment({
            paymentIntentId: result.paymentIntentId,
            subscriptionTier: selectedPlan.id
          });
        }
      }
    } catch (err) {
      setLocalError('Payment processing failed. Please try again.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {localError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {localError}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || loading}
        sx={{ mt: 3, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} /> : `Subscribe to ${selectedPlan.name}`}
      </Button>
    </Box>
  );
};

// Main Subscription Management Component
const SubscriptionManagementContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo, isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get parameters from URL
  const requestedPlan = searchParams.get('plan');
  const action = searchParams.get('action');

  // Current user data
  const currentPlan = userInfo?.organization?.subscriptionTier;
  const currentStatus = userInfo?.organization?.subscriptionStatus;
  const userCount = userInfo?.organization?.userCount || 0;
  const maxUsers = userInfo?.organization?.maxUsers || 0;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  const currentPlanData = plans.find(p => p.id === currentPlan);
  const requestedPlanData = plans.find(p => p.id === requestedPlan);

  const handlePayment = async () => {
    // Set loading state when payment starts
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/organizations/update-subscription', {
        subscriptionTier: requestedPlan,
      });

      // Return the response with clientSecret and paymentIntentId
      return {
        clientSecret: response.data.clientSecret,
        paymentIntentId: response.data.paymentIntentId,
        amount: response.data.amount
      };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || err.message || 'Payment setup failed');
      throw err;
    }
  };

  const handlePaymentConfirm = async (result) => {
    try {
      // Call backend to confirm subscription update
      const confirmResponse = await api.post('/organizations/confirm-subscription', {
        subscriptionTier: result.subscriptionTier,
        paymentIntentId: result.paymentIntentId,
      });

      setLoading(false);
      if (confirmResponse.data && confirmResponse.data.success) {
        setSuccess(`Successfully upgraded to ${requestedPlanData.name}!`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError('Subscription confirmation failed. Please contact support.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || err.message || 'Subscription confirmation failed');
    }
  };

  const handleFreePlanChange = async () => {
    setLoading(true);
    setError(null);

    try {
      // For free plans, just update the subscription
      await api.post('/organizations/update-subscription', {
        subscriptionTier: requestedPlan,
      });

      setSuccess(`Successfully changed to ${requestedPlanData.name}!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Plan change failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Subscription Management
      </Typography>

      {/* Current Plan Status */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Current Plan</Typography>
            <Chip
              label={currentStatus === 'trial' ? 'Trial' : 'Active'}
              color={currentStatus === 'trial' ? 'warning' : 'success'}
            />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Plan:</strong> {currentPlanData?.name || 'Unknown'}
              </Typography>
              <Typography variant="body1">
                <strong>Users:</strong> {userCount} / {maxUsers}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Price:</strong> {currentPlanData?.priceDisplay || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {currentStatus}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Requested Plan Change */}
      {requestedPlan && requestedPlan !== currentPlan && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {action === 'upgrade' ? 'Upgrade' : 'Change'} Plan
            </Typography>
            <Typography variant="body1" gutterBottom>
              You're about to {action} from <strong>{currentPlanData?.name}</strong> to{' '}
              <strong>{requestedPlanData?.name}</strong>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {requestedPlanData?.name}
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {requestedPlanData?.priceDisplay}
                </Typography>
                <List dense>
                  {requestedPlanData?.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                {requestedPlanData?.price > 0 ? (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Complete the payment below to activate your new plan.
                  </Alert>
                ) : (
                  <Box>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      This is a free plan change. Your current features will be adjusted accordingly.
                    </Alert>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleFreePlanChange}
                      disabled={loading}
                      sx={{ py: 1.5 }}
                    >
                      {loading ? <CircularProgress size={24} /> : `Change to ${requestedPlanData.name}`}
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Payment Form Container */}
      {requestedPlan && requestedPlan !== currentPlan && requestedPlanData?.price > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Complete Payment
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              Enter your payment information to complete the subscription change.
            </Typography>

            <Elements stripe={stripePromise}>
              <PaymentForm
                onSubmit={handlePayment}
                onConfirmPayment={handlePaymentConfirm}
                loading={loading}
                selectedPlan={requestedPlanData}
              />
            </Elements>
          </CardContent>
        </Card>
      )}

      {/* Trial Activation */}
      {currentStatus === 'trial' && !requestedPlan && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="warning.main">
              Activate Your Free Trial
            </Typography>
            <Typography variant="body1" gutterBottom>
              You're currently on a trial of the {currentPlanData?.name} plan.
              Activate your account to continue using all features.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/register-org')}
              sx={{ mt: 2 }}
            >
              Activate Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Back to Dashboard */}
      <Box textAlign="center" mt={4}>
        <Button variant="outlined" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default function SubscriptionManagement() {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionManagementContent />
    </Elements>
  );
}
