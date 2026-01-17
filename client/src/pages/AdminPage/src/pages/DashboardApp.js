// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography, Card, CardContent, Button, Alert, Chip, Stack } from "@mui/material";
// components
import Page from "../components/Page";
import Iconify from "../components/Iconify";
// sections
import {
  AppTasks,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from "../sections/@dashboard/app";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedUsers, getDashboardAnalytics, getUserRegistrationTrends } from "../../../../slices/adminSlice";
import { TaskDialog } from "../../../../features/tasks";

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(getApprovedUsers());
    dispatch(getDashboardAnalytics());
    dispatch(getUserRegistrationTrends(30));
  }, [dispatch]);

  const theme = useTheme();
  const users = useSelector((state) => {
    return state.admin.usersApproved;
  });
  const analytics = useSelector((state) => state.admin.dashboardAnalytics);
  const registrationTrends = useSelector((state) => state.admin.registrationTrends);
  const loading = useSelector((state) => state.admin.loading);

  const { userInfo } = useSelector((state) => state.user);

  const allUsers = users?.student?.concat(users?.teacher || [], users?.admin || []) || [];

  const handleOpenTaskDialog = (task = null) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Hi, Welcome back
        </Typography>

        {/* Quick Actions & Alerts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {analytics?.pendingUsers > 0 && (
            <Grid item xs={12} md={6}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  You have <strong>{analytics.pendingUsers}</strong> pending user approval{analytics.pendingUsers > 1 ? 's' : ''}.
                  <Button size="small" sx={{ ml: 1 }} onClick={() => navigate('/dashboard/user')}>
                    Review Now
                  </Button>
                </Typography>
              </Alert>
            </Grid>
          )}

          {analytics?.quickStats?.utilizationRate > 80 && (
            <Grid item xs={12} md={6}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Your organization is at <strong>{analytics.quickStats.utilizationRate}%</strong> user capacity.
                  Consider upgrading your plan for more users.
                </Typography>
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button variant="outlined" size="small" onClick={() => navigate('/dashboard/users')}>
                    Manage Users
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => navigate('/dashboard/classes')}>
                    View Classes
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => navigate('/settings')}>
                    Organization Settings
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => navigate('/subscription')}>
                    Manage Subscription
                  </Button>
                  <Chip
                    label={`Plan: ${userInfo?.organization?.subscriptionTier?.replace('_', ' ') || 'Unknown'}`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Users: ${analytics?.quickStats?.totalUsers || 0}/${userInfo?.organization?.maxUsers || 0}`}
                    color={analytics?.quickStats?.utilizationRate > 80 ? "warning" : "success"}
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total Users"
              total={analytics?.quickStats?.totalUsers || users?.student?.length + users?.teacher?.length + users?.admin?.length}
              icon={"icons8:student"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Active Users"
              total={analytics?.quickStats?.activeUsers || 0}
              color="info"
              icon={"fa-solid:chalkboard-teacher"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Pending Approvals"
              total={analytics?.pendingUsers || 0}
              color="warning"
              icon={"material-symbols:admin-panel-settings-outline"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Utilization Rate"
              total={`${analytics?.quickStats?.utilizationRate || 0}%`}
              color="success"
              icon={"material-symbols:admin-panel-settings-outline"}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="User Registration Trends"
              subheader={`Last ${registrationTrends?.length || 30} days`}
              chartLabels={registrationTrends?.map(trend => {
                const date = new Date(trend.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }) || []}
              chartData={[
                {
                  name: "New Registrations",
                  type: "area",
                  fill: "gradient",
                  data: registrationTrends?.map(trend => trend.registrations) || [],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="User Distribution"
              chartData={[
                { label: "Students", value: users?.student?.length || 0 },
                { label: "Teachers", value: users?.teacher?.length || 0 },
                { label: "Admins", value: users?.admin?.length || 0 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Organization Performance"
              subheader="Key metrics and utilization"
              chartData={[
                {
                  label: "Classes Created",
                  value: analytics?.classCount || 0
                },
                {
                  label: "Subjects Offered",
                  value: analytics?.subjectCount || 0
                },
                {
                  label: "User Capacity",
                  value: userInfo?.organization?.maxUsers || 0
                },
                {
                  label: "Active Users",
                  value: analytics?.quickStats?.totalUsers || 0
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Subject Popularity"
              chartLabels={analytics?.subscription ? ["Primary", "High School", "University"] : ["Loading..."]}
              chartData={[
                {
                  name: "Plan Distribution",
                  data: analytics?.subscription ?
                    [
                      analytics.subscription.tierDistribution?.primary || 0,
                      analytics.subscription.tierDistribution?.high_school || 0,
                      analytics.subscription.tierDistribution?.university || 0
                    ] : [0, 0, 0]
                },
              ]}
              chartColors={[...Array(3)].map(
                () => theme.palette.primary.main
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Recent Activity"
              list={
                analytics?.recentActivity?.slice(0, 4).map((user, index) => ({
                  name: user.name,
                  value: new Date(user.lastLogin).getTime(),
                  icon: (
                    <Iconify
                      icon={
                        user.role === 'admin' ? "material-symbols:admin-panel-settings-outline" :
                        user.role === 'teacher' ? "fa-solid:chalkboard-teacher" :
                        "icons8:student"
                      }
                      color={
                        user.role === 'admin' ? "#FF6B35" :
                        user.role === 'teacher' ? "#4CAF50" :
                        "#2196F3"
                      }
                      width={32}
                      height={32}
                    />
                  ),
                })) || [
                  {
                    name: "Loading...",
                    value: 0,
                    icon: <Iconify icon="eos-icons:loading" width={32} height={32} />,
                  }
                ]
              }
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              onAddTask={() => handleOpenTaskDialog()}
              onEditTask={(task) => handleOpenTaskDialog(task)}
            />
          </Grid>
        </Grid>
      </Container>

      <TaskDialog
        open={taskDialogOpen}
        onClose={handleCloseTaskDialog}
        task={editingTask}
        users={allUsers}
      />
    </Page>
  );
}
