import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Import task components
import AppTasks from '../components/AppTasks';
import TaskDialog from '../components/TaskDialog';
import KanbanBoard from '../components/KanbanBoard';

// Import Redux actions and selectors
import { fetchTasks, fetchTaskStats } from '../../../slices/taskSlice';
import {
  selectTasks,
  selectTasksLoading,
  selectTasksError,
  selectTaskStats,
} from '../../../slices/taskSlice';

// Import user slice to get current user and available users
import userSlice from '../../../slices/userSlice';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TaskPage = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Redux selectors
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const stats = useSelector(selectTaskStats);
  const currentUser = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    // Fetch tasks and stats on component mount
    dispatch(fetchTasks());
    dispatch(fetchTaskStats());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenTaskDialog = (task = null) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  // Mock users list - in a real app, this would come from an API
  const mockUsers = [
    { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'student' },
    { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'teacher' },
    { _id: '3', firstName: 'Bob', lastName: 'Wilson', email: 'bob@example.com', role: 'admin' },
  ];

  if (loading && tasks.length === 0) {
    return (
      <Container maxWidth="xl">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Task Management
      </Typography>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Tasks
                </Typography>
                <Typography variant="h5">
                  {stats.totalTasks || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Open Tasks
                </Typography>
                <Typography variant="h5">
                  {stats.statusStats?.find(s => s._id === 'Open')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h5">
                  {stats.statusStats?.find(s => s._id === 'InProgress')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h5">
                  {stats.statusStats?.find(s => s._id === 'Close')?.count || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Main Content */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="task tabs">
            <Tab label="Dashboard" />
            <Tab label="Kanban Board" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Recent Tasks</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleOpenTaskDialog()}
                >
                  Create Task
                </Button>
              </Box>
              <AppTasks onAddTask={() => handleOpenTaskDialog()} />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <KanbanBoard />
        </TabPanel>
      </Card>

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onClose={handleCloseTaskDialog}
        task={editingTask}
        users={mockUsers}
      />
    </Container>
  );
};

export default TaskPage;
