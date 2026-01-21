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
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AssignmentOutlined,
  PersonOutline,
  AccessTime,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

// Import task components
import TaskDialog from '../components/TaskDialog';
import KanbanBoard from '../components/KanbanBoard';

// Import Redux actions and selectors
import { fetchTasks, fetchTaskStats, deleteTask } from '../../../slices/taskSlice';
import {
  selectTasks,
  selectTasksLoading,
  selectTasksError,
  selectTaskStats,
} from '../../../slices/taskSlice';

// Import admin slice to get approved users
import { getApprovedUsers } from '../../../slices/adminSlice';

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
  const stats = useSelector(selectTaskStats);
  const users = useSelector((state) => state.admin.usersApproved);

  // Combine all user types into a single array
  const allUsers = users?.student?.concat(users?.teacher || [], users?.admin || []) || [];

  useEffect(() => {
    // Fetch tasks and stats on component mount
    dispatch(fetchTasks());
    dispatch(fetchTaskStats());
    dispatch(getApprovedUsers());
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

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };


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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'primary';
      case 'InProgress':
        return 'warning';
      case 'Testing':
        return 'info';
      case 'Close':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'error';
      case 'High':
        return 'warning';
      case 'Normal':
        return 'info';
      case 'Low':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" fontWeight={600}>
          Task Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenTaskDialog()}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 1.5,
            boxShadow: 2,
          }}
        >
          Create Task
        </Button>
      </Stack>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                      Total Tasks
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="text.primary">
                      {stats.totalTasks || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: 'primary.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AssignmentOutlined sx={{ color: 'primary.main', fontSize: 28 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                      Open Tasks
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {stats.statusStats?.find(s => s._id === 'Open')?.count || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: 'primary.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <RadioButtonUnchecked sx={{ color: 'primary.main', fontSize: 28 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                      In Progress
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="warning.main">
                      {stats.statusStats?.find(s => s._id === 'InProgress')?.count || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: 'warning.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccessTime sx={{ color: 'warning.main', fontSize: 28 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
                      Completed
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {stats.statusStats?.find(s => s._id === 'Close')?.count || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: 'success.lighter',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Main Content */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="task tabs"
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 64,
              },
            }}
          >
            <Tab label="Dashboard" />
            <Tab label="Kanban Board" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" fontWeight={600}>
                All Tasks
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleOpenTaskDialog()}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Add Task
              </Button>
            </Stack>

            {/* Custom Task List */}
            {tasks.length > 0 ? (
              <Stack spacing={1.5}>
                {tasks.map((task, index) => (
                  <Paper
                    key={task._id}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                        >
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {task.description}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                          {task.status && (
                            <Chip
                              label={task.status}
                              size="small"
                              color={getStatusColor(task.status)}
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                          {task.priority && (
                            <Chip
                              label={task.priority}
                              size="small"
                              variant="outlined"
                              color={getPriorityColor(task.priority)}
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                          {task.assignee && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PersonOutline sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {task.assignee.firstName} {task.assignee.lastName}
                              </Typography>
                              <Tooltip title={`Assigned to ${task.assignee.firstName} ${task.assignee.lastName}`}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: '0.7rem',
                                    bgcolor: 'primary.main',
                                  }}
                                  src={task.assignee.profileImage}
                                >
                                  {task.assignee.firstName?.[0]}
                                </Avatar>
                              </Tooltip>
                            </Stack>
                          )}
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit Task">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenTaskDialog(task)}
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.lighter',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Task">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTask(task._id)}
                            sx={{
                              color: 'error.main',
                              '&:hover': {
                                bgcolor: 'error.lighter',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <AssignmentOutlined sx={{ fontSize: 48, color: 'text.disabled' }} />
                </Box>
                <Typography variant="h6" color="text.primary" gutterBottom fontWeight={600}>
                  No Tasks Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                  Get started by creating your first task. Tasks help you stay organized and track your progress.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenTaskDialog()}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Create Your First Task
                </Button>
              </Paper>
            )}
          </Box>
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
        users={allUsers}
      />
    </Container>
  );
};

export default TaskPage;
