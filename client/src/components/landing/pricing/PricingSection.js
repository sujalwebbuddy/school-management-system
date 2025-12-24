'use strict';

import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getUserData } from '../../../slices/userSlice';
import { getAllPlans, getPlanById } from '../../../constants/subscriptionPlans';

const PricingSection = () => {
  const dispatch = useDispatch();
  const { userInfo, isAuth } = useSelector((state) => state.user);

  // Ensure user data is loaded
  useEffect(() => {
    if (isAuth && (!userInfo?.organization || !userInfo?.organization?.subscriptionTier)) {
      dispatch(getUserData());
    }
  }, [isAuth, userInfo, dispatch]);

  // Transform plans from constants to component format
  const basePlans = getAllPlans().map(plan => ({
    name: plan.name.toUpperCase(),
    tier: plan.id,
    price: plan.priceDisplay,
    billing: plan.billing,
    features: [
      { text: plan.name, bold: true },
      ...plan.features.map(feature => ({ text: feature, bold: false }))
    ],
    buttonColor: plan.buttonColor,
    buttonTextColor: plan.buttonTextColor,
    borderColor: plan.borderColor,
    backgroundColor: plan.backgroundColor,
    textColor: plan.textColor,
    featured: plan.featured,
  }));

  // Determine user's current plan and available actions
  const userPlan = userInfo?.organization?.subscriptionTier;
  const isOnTrial = userInfo?.organization?.subscriptionStatus === 'trial';

  console.log('PricingSection - isAuth:', isAuth);

  const getPlanStatus = (planTier) => {
    // If not authenticated or organization data not loaded, show signup
    if (!isAuth || !userInfo?.organization?.subscriptionTier) return 'signup';

    const currentPlan = userInfo.organization.subscriptionTier;
    const tierHierarchy = { primary: 0, high_school: 1, university: 2 };
    const currentTierLevel = tierHierarchy[currentPlan] || 0;
    const planTierLevel = tierHierarchy[planTier] || 0;

    if (planTier === currentPlan) return 'current';
    if (planTierLevel > currentTierLevel) return 'upgrade';
    if (planTierLevel < currentTierLevel) return 'downgrade';
    return 'signup';
  };

  const getButtonText = (planTier) => {
    const status = getPlanStatus(planTier);
    switch (status) {
      case 'current':
        return isOnTrial ? 'Activate Plan' : 'Current Plan';
      case 'upgrade':
        return 'Upgrade';
      case 'downgrade':
        return 'Downgrade';
      default:
        return 'Get Started';
    }
  };

  const getButtonColor = (planTier, originalButtonColor) => {
    const status = getPlanStatus(planTier);
    if (status === 'current') return '#10b981'; // Green for current plan
    if (status === 'upgrade') return '#f59e0b'; // Amber for upgrade
    return originalButtonColor;
  };

  // Enhanced plans with user-specific data
  const plans = basePlans.map(plan => {
    const currentPlan = userInfo?.organization?.subscriptionTier;
    const isCurrentPlan = plan.tier === currentPlan;
    const userCount = userInfo?.organization?.userCount || 0;
    const maxUsers = userInfo?.organization?.maxUsers || 0;

    return {
      ...plan,
      status: getPlanStatus(plan.tier),
      buttonColor: getButtonColor(plan.tier, plan.buttonColor),
      buttonText: getButtonText(plan.tier),
      isCurrentPlan,
      userCount: isCurrentPlan ? userCount : null,
      maxUsers: isCurrentPlan ? maxUsers : null,
    };
  });

  const handleBuyNow = (plan) => {
    const status = plan.status;

    if (status === 'current') {
      if (isOnTrial) {
        // For trial users, redirect to subscription management to activate
        window.location.href = '/subscription';
      } else {
        // For active users, redirect to dashboard
        window.location.href = '/dashboard';
      }
    } else if (status === 'upgrade' || status === 'downgrade') {
      // For upgrades/downgrades, redirect to subscription management
      window.location.href = `/subscription?plan=${plan.tier}&action=${status}`;
    } else {
      // For signup (not logged in users)
      window.location.href = '/register-org';
    }
  };

  return (
    <Box
      component="section"
      id="pricing"
      sx={{
        width: '100%',
        backgroundColor: 'white',
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'primary.main',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              mb: 2,
              display: 'block',
            }}
          >
            PRICING
          </Typography>

          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 2,
            }}
          >
            {isAuth && userInfo?.organization?.subscriptionTier ? 'Manage Your' : 'Reasonable & Flexible'}{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              {isAuth && userInfo?.organization?.subscriptionTier ? 'Subscription' : 'Plans.'}
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: 'text.secondary',
              maxWidth: '42rem',
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            {isAuth && userInfo?.organization?.subscriptionTier
              ? `You're currently on the ${userInfo.organization.subscriptionTier?.replace('_', ' ')} plan. ${
                  userInfo.organization.subscriptionTier === 'primary' || userInfo.organization.subscriptionTier === 'high_school'
                    ? 'Upgrade to access more features and higher user limits.'
                    : 'You have access to all features.'
                }`
              : isAuth
              ? 'Loading your subscription information...'
              : 'Choose the perfect plan for your educational institution. Start with our free plan or upgrade to access advanced features.'
            }
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: plan.backgroundColor,
                  borderTop: plan.isCurrentPlan
                    ? '4px solid #10b981'
                    : `4px solid ${plan.borderColor}`,
                  borderRadius: 2,
                  boxShadow: plan.isCurrentPlan
                    ? '0 10px 40px rgba(16, 185, 129, 0.3)'
                    : plan.featured
                    ? '0 10px 40px rgba(100, 21, 255, 0.2)'
                    : '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: plan.isCurrentPlan
                      ? '0 15px 50px rgba(16, 185, 129, 0.4)'
                      : plan.featured
                      ? '0 15px 50px rgba(100, 21, 255, 0.3)'
                      : '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 3, md: 4 },
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        fontWeight: 'bold',
                        color: plan.textColor,
                        textTransform: 'uppercase',
                      }}
                    >
                      {plan.name}
                    </Typography>
                    {plan.isCurrentPlan && (
                      <Chip
                        label={isOnTrial ? "Trial" : "Current Plan"}
                        size="small"
                        sx={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 'bold',
                        color: plan.textColor,
                        lineHeight: 1,
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.75rem',
                        color: plan.featured ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      {plan.billing}
                    </Typography>
                    {plan.isCurrentPlan && plan.userCount !== null && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.7rem',
                          color: plan.textColor,
                          opacity: 0.8,
                          display: 'block',
                          mt: 0.5,
                        }}
                      >
                        {plan.userCount} / {plan.maxUsers} users
                      </Typography>
                    )}
                  </Box>

                  <List
                    sx={{
                      flexGrow: 1,
                      mt: 2,
                      mb: 3,
                      '& .MuiListItem-root': {
                        px: 0,
                        py: 0.5,
                      },
                    }}
                  >
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex}>
                        <ListItemText
                          primary={feature.text}
                          primaryTypographyProps={{
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            fontWeight: feature.bold ? 'bold' : 'normal',
                            color: plan.textColor,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleBuyNow(plan)}
                    disabled={plan.status === 'current' && !isOnTrial}
                    sx={{
                      backgroundColor: plan.buttonColor,
                      color: plan.buttonTextColor,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      borderRadius: 1,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      '&:hover': {
                        backgroundColor: plan.buttonColor,
                        opacity: 0.9,
                      },
                      '&:disabled': {
                        backgroundColor: plan.buttonColor,
                        opacity: 0.6,
                      },
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PricingSection;

