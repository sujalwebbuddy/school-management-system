'use strict';

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import swal from 'sweetalert';
import api from '../utils/api';
import { getAllPlans } from '../constants/subscriptionPlans';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51...');

const steps = ['Choose Plan', 'Organization Details', 'Admin Account', 'Payment'];

// Use plans from constants
const plans = getAllPlans();

// Payment Form Component
const PaymentForm = ({ onSubmit, loading, selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is not loaded. Please refresh the page.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    // Create payment method
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (pmError) {
      setError(pmError.message);
      return;
    }

    if (!paymentMethod || !paymentMethod.id) {
      setError('Failed to create payment method');
      return;
    }

    await onSubmit(paymentMethod.id);
  };

  const cardElementOptions = {
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
  };

  if (selectedPlan.price === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          This plan is free. No payment required.
        </Alert>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await onSubmit(null); // No payment method needed for free plan
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Complete Signup'}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Information
      </Typography>
      <form onSubmit={handleSubmit} id="payment-form">
        <Card sx={{ p: 2, mt: 2, mb: 2 }}>
          <CardElement options={cardElementOptions} />
        </Card>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!stripe || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Complete Signup & Pay'}
        </Button>
      </form>
    </Box>
  );
};

// Main Signup Component
const OrganizationSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  // Get email from navigation state if provided
  const prefillEmail = location.state?.email || '';

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      email: prefillEmail,
    },
  });

  // Set email value if provided via navigation state
  useEffect(() => {
    if (prefillEmail) {
      setValue('email', prefillEmail);
    }
  }, [prefillEmail, setValue]);

  const organizationName = watch('organizationName');
  const domain = watch('domain');

  // Generate domain suggestion from organization name
  useEffect(() => {
    if (organizationName && !domain) {
      const suggestedDomain = organizationName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30);
      // Note: We can't directly set form value, but we can show it as placeholder
    }
  }, [organizationName, domain]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setError(null);
    
    // If plan requires payment, create payment intent
    if (plan.price > 0) {
      createPaymentIntent(plan.id);
    } else {
      setClientSecret(null);
    }
    
    setActiveStep(1);
  };

  const createPaymentIntent = async (tier) => {
    try {
      const response = await api.post('/organizations/create-payment-intent', {
        subscriptionTier: tier,
      });
      
      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
      }
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError(err.message || 'Failed to initialize payment. Please try again.');
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedPlan) {
      setError('Please select a plan');
      return;
    }
    
    // Validate current step before proceeding
    if (activeStep === 1) {
      const orgName = watch('organizationName');
      const domain = watch('domain');
      if (!orgName || !domain) {
        setError('Please fill in all organization details');
        return;
      }
    }
    
    if (activeStep === 2) {
      const firstName = watch('firstName');
      const lastName = watch('lastName');
      const email = watch('email');
      const password = watch('password');
      const phoneNumber = watch('phoneNumber');
      if (!firstName || !lastName || !email || !password || !phoneNumber) {
        setError('Please fill in all admin account details');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinalSubmit = async (paymentMethodId) => {
    setLoading(true);
    setError(null);

    try {
      const formData = watch();
      
      // Validate all required fields
      if (!formData.organizationName || !formData.domain || !formData.firstName || 
          !formData.lastName || !formData.email || !formData.password || !formData.phoneNumber) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!selectedPlan) {
        setError('Please select a subscription plan');
        setLoading(false);
        return;
      }
      
      const signupData = {
        name: formData.organizationName,
        domain: formData.domain,
        subscriptionTier: selectedPlan.id,
        admin: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
        },
        paymentMethodId: paymentMethodId || 'free', // Use 'free' for $0 plans
      };

      console.log('Submitting signup data:', { ...signupData, admin: { ...signupData.admin, password: '***' } });

      const response = await api.post('/organizations/signup', signupData);

      console.log('Signup response:', response.data);

      if (response.data.success) {
        // Store token and redirect
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuth', 'true');
        
        await swal(
          'Success!',
          'Your organization has been created successfully! Redirecting to dashboard...',
          'success'
        );
        
        // Redirect to admin dashboard
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        'Signup failed. Please try again.';
      
      setError(errorMessage);
      
      await swal('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom align="center">
              Choose Your Plan
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {plans.map((plan) => (
                <Grid item xs={12} md={4} key={plan.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedPlan?.id === plan.id ? `3px solid ${plan.color}` : '1px solid #e0e0e0',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {plan.name}
                      </Typography>
                      <Typography variant="h4" color={plan.color} gutterBottom>
                        {plan.priceDisplay}
                      </Typography>
                      <Box component="ul" sx={{ mt: 2, pl: 2 }}>
                        {plan.features.map((feature, idx) => (
                          <li key={idx}>
                            <Typography variant="body2">{feature}</Typography>
                          </li>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Organization Details
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  {...register('organizationName', {
                    required: 'Organization name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters',
                    },
                  })}
                  error={!!errors.organizationName}
                  helperText={errors.organizationName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Domain (e.g., springfield-high)"
                  {...register('domain', {
                    required: 'Domain is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Domain can only contain lowercase letters, numbers, and hyphens',
                    },
                    minLength: {
                      value: 3,
                      message: 'Domain must be at least 3 characters',
                    },
                  })}
                  error={!!errors.domain}
                  helperText={errors.domain?.message || 'This will be your unique organization identifier'}
                  placeholder={organizationName
                    ? organizationName
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .substring(0, 30)
                    : 'springfield-high'}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Admin Account Details
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                  })}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 3 }} onClick={(e) => e.stopPropagation()}>
            <Typography variant="h5" gutterBottom>
              Payment
            </Typography>
            {selectedPlan && (
              <Box sx={{ mt: 2 }}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">{selectedPlan.name}</Typography>
                  <Typography variant="h4" color="primary">
                    {selectedPlan.priceDisplay}
                  </Typography>
                </Card>
                {selectedPlan.price > 0 && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                      onSubmit={handleFinalSubmit}
                      loading={loading}
                      selectedPlan={selectedPlan}
                    />
                  </Elements>
                ) : (
                  <PaymentForm
                    onSubmit={handleFinalSubmit}
                    loading={loading}
                    selectedPlan={selectedPlan}
                  />
                )}
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Create Your Organization
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get started with your school management system
        </Typography>
      </Box>

      <Card sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box>
          {renderStepContent(activeStep)}

          {activeStep < steps.length - 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                type="button"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={handleNext}
                disabled={!selectedPlan && activeStep === 0}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Button
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ textTransform: 'none' }}
          >
            Sign In
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default OrganizationSignup;
