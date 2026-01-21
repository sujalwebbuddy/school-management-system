import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// @mui
import {
  Card,
  Stack,
  Divider,
  Checkbox,
  MenuItem,
  IconButton,
  CardHeader,
  FormControlLabel,
  Button,
  Box,
  CircularProgress,
  Typography,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, deleteTask } from '../../../../../../slices/taskSlice';
import { selectTasks, selectTasksLoading, selectTasksError } from '../../../../../../slices/taskSlice';

// ----------------------------------------------------------------------

AppTasks.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  onAddTask: PropTypes.func,
  onEditTask: PropTypes.func,
};

export default function AppTasks({ title, subheader, onAddTask, onEditTask, ...other }) {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);

  // Get only the first 5 tasks for the dashboard widget, keep full task object
  const displayTasks = tasks.slice(0, 5);

  const formik = useFormik({
    initialValues: {
      checked: displayTasks.filter(task => task.status === 'Close').map(task => task._id),
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { values, handleSubmit } = formik;

  useEffect(() => {
    // Fetch tasks when component mounts
    dispatch(fetchTasks({ limit: 10 }));
  }, [dispatch]);

  const handleMarkComplete = async (taskId) => {
    try {
      await dispatch(updateTask({
        taskId,
        taskData: { status: 'Close' }
      })).unwrap();
    } catch (error) {
      console.error('Failed to mark task complete:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (loading && tasks.length === 0) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={24} />
        </Box>
      </Card>
    );
  }

  return (
    <Card
      {...other}
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...other.sx,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        }
        subheader={
          subheader && (
          <Typography variant="body2" color="text.secondary">
            {subheader}
          </Typography>
        )}
        action={
          <Button
            variant="contained"
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={onAddTask}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1.5,
              px: 2,
              boxShadow: 2,
            }}
          >
            Add Task
          </Button>
        }
        sx={{
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {displayTasks.length > 0 ? (
              <Stack spacing={0} divider={<Divider sx={{ mx: 2 }} />}>
                {displayTasks.map((task) => (
            <TaskItem
                    key={task._id}
              task={task}
                checked={values.checked.includes(task._id)}
              formik={formik}
                onMarkComplete={handleMarkComplete}
                onDelete={handleDelete}
              onEdit={onEditTask}
            />
          ))}
              </Stack>
            ) : (
              <Box
                p={4}
                textAlign="center"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 200,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Iconify
                    icon="eva:file-text-outline"
                    width={40}
                    height={40}
                    sx={{ color: 'text.disabled' }}
                  />
                </Box>
                <Typography variant="h6" color="text.primary" gutterBottom fontWeight={600}>
                  No Tasks Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 280 }}>
                  Get started by creating your first task to stay organized and productive.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={onAddTask}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Create Task
                </Button>
              </Box>
            )}
            </Box>
        </Form>
      </FormikProvider>
    </Card>
  );
}

// ----------------------------------------------------------------------

TaskItem.propTypes = {
  formik: PropTypes.object,
  checked: PropTypes.bool,
  task: PropTypes.object,
  onMarkComplete: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

function TaskItem({ formik, task, checked, onMarkComplete, onDelete, onEdit, ...other }) {
  const { getFieldProps } = formik;

  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleMarkComplete = () => {
    handleCloseMenu();
    onMarkComplete(task._id);
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = () => {
    handleCloseMenu();
    onDelete(task._id);
  };

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
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        px: 2.5,
        py: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        ...(checked && {
          opacity: 0.6,
          '& .MuiTypography-root': {
            textDecoration: 'line-through',
          color: 'text.disabled',
          },
        }),
      }}
    >
      <Checkbox
        {...getFieldProps('checked')}
        value={task._id}
        checked={checked}
        sx={{
          p: 0.5,
          '& .MuiSvgIcon-root': {
            fontSize: 20,
          },
        }}
        {...other}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.title}
        </Typography>
        {task.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 1,
            }}
          >
            {task.description}
          </Typography>
        )}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {task.status && (
            <Chip
              label={task.status}
              size="small"
              color={getStatusColor(task.status)}
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 600,
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
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            />
          )}
          {task.assignee && (
            <Tooltip title={`Assigned to ${task.assignee.firstName} ${task.assignee.lastName}`}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: 'primary.main',
                }}
                src={task.assignee.profileImage}
              >
                {task.assignee.firstName?.[0]}
              </Avatar>
            </Tooltip>
          )}
        </Stack>
      </Box>

      <MoreMenuButton
        open={open}
        onClose={handleCloseMenu}
        onOpen={handleOpenMenu}
        actions={
          <>
            <MenuItem onClick={handleMarkComplete}>
              <Iconify icon={'eva:checkmark-circle-2-fill'} />
              Mark Complete
            </MenuItem>

            <MenuItem onClick={handleEdit}>
              <Iconify icon={'eva:edit-fill'} />
              Edit
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed', my: 0.5 }} />

            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon={'eva:trash-2-outline'} />
              Delete
            </MenuItem>
          </>
        }
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

MoreMenuButton.propTypes = {
  actions: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.object,
};

function MoreMenuButton({ actions, open, onOpen, onClose }) {
  return (
    <>
      <IconButton
        size="small"
        color="inherit"
        onClick={onOpen}
        sx={{
          opacity: 0.6,
          '&:hover': {
            opacity: 1,
            bgcolor: 'action.hover',
          },
        }}
      >
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 180,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1,
            typography: 'body2',
            borderRadius: 1,
            '& svg': {
              mr: 1.5,
              width: 20,
              height: 20,
            },
            '&:hover': {
              bgcolor: 'action.hover',
            },
          },
        }}
      >
        {actions}
      </MenuPopover>
    </>
  );
}
