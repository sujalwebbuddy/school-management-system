import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

const FeatureGuard = ({
  children,
  feature,
  fallbackPath = '/dashboard',
  showUpgradeMessage = true
}) => {
  const { userInfo, isAuth } = useSelector((state) => state.user);

  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // If organization data is not loaded yet, show loading
  if (!userInfo?.organization?.subscriptionTier) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  const subscriptionTier = userInfo.organization.subscriptionTier;
  const features = userInfo.organization.features || [];
  const isPrimaryPlan = subscriptionTier === 'primary';

  // Check if feature is available
  const hasFeature = features.includes(feature);

  // Primary plan blocks chat specifically
  if (feature === 'chat' && isPrimaryPlan) {
    if (showUpgradeMessage) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          textAlign="center"
          sx={{ p: 3 }}
        >
          <Typography variant="h4" color="text.secondary" gutterBottom>
            Chat Feature Not Available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
            The chat feature is not included in the Primary School (free) plan.
            Upgrade to High School or University plan to access messaging and real-time communication features.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact your administrator to upgrade your organization's subscription.
          </Typography>
        </Box>
      );
    } else {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // General feature check
  if (!hasFeature) {
    if (showUpgradeMessage) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          textAlign="center"
          sx={{ p: 3 }}
        >
          <Typography variant="h4" color="text.secondary" gutterBottom>
            Feature Not Available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
            This feature is not included in your current subscription plan.
            Please upgrade your subscription to access this feature.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact your administrator to upgrade your organization's subscription.
          </Typography>
        </Box>
      );
    } else {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children;
};

export default FeatureGuard;
