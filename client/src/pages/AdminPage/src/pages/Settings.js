'use strict';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  Alert,
  Button,
} from '@mui/material';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import SubscriptionStatus from '../../../../components/SubscriptionStatus';
import { getPlanById, getAllPlans, isUpgrade } from '../../../../constants/subscriptionPlans';

const Settings = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });

  const currentPlan = userInfo?.organization?.subscriptionTier;
  const currentPlanData = getPlanById(currentPlan);
  const availableUpgrades = getAllPlans().filter(plan =>
    plan.id !== currentPlan && isUpgrade(currentPlan, plan.id)
  );

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleManageSubscription = () => {
    navigate('/subscription');
  };

  const handleUpgradePlan = (planId) => {
    navigate(`/subscription?plan=${planId}&action=upgrade`);
  };

  return (
    <Page title="Settings">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
      </Stack>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Organization Information */}
          {userInfo?.organization && (
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Organization Information"
                  action={
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleManageSubscription}
                      sx={{ mr: 1 }}
                    >
                      Manage Subscription
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  <SubscriptionStatus organization={userInfo.organization} showDetails={true} />

                  {/* Subscription Management Section */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Subscription Management
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Plan: <strong>{currentPlanData?.displayName || 'Unknown'}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentPlanData?.priceDisplay || 'N/A'} • {currentPlanData?.maxUsers || 0} users max
                      </Typography>
                    </Box>

                    {availableUpgrades.length > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Available Upgrades:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {availableUpgrades.map((plan) => (
                            <Button
                              key={plan.id}
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() => handleUpgradePlan(plan.id)}
                              sx={{
                                minWidth: 'auto',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Upgrade to {plan.displayName} ({plan.priceDisplay})
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {availableUpgrades.length === 0 && currentPlan !== 'university' && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        You are on the highest tier plan. Contact support for custom enterprise solutions.
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Notification Preferences" />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Receive email notifications for important updates
                  </Typography>

                  <Divider />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                      />
                    }
                    label="Push Notifications"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Receive push notifications in your browser
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Account Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Account Settings" />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Account Type
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userInfo?.role || 'Admin'}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Email Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userInfo?.email || 'Not set'}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Organization
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userInfo?.organization?.name || 'Not assigned'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* System Information */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="System Information" />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Alert severity="info">
                    For advanced settings and organization management, please contact your system administrator.
                  </Alert>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Platform Version: 1.0.0
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Last Updated: {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Settings;
