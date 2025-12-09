import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// @mui
import { Card, Stack, Divider, Checkbox, MenuItem, IconButton, CardHeader, FormControlLabel, Button, Box, CircularProgress } from '@mui/material';
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
};

export default function AppTasks({ title, subheader, onAddTask, ...other }) {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);

  // Get only the first 5 tasks for the dashboard widget
  const displayTasks = tasks.slice(0, 5).map(task => ({
    id: task._id,
    label: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
  }));

  const formik = useFormik({
    initialValues: {
      checked: displayTasks.filter(task => task.status === 'Close').map(task => task.id),
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
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={onAddTask}
          >
            Add Task
          </Button>
        }
      />

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {displayTasks.length > 0 ? (
            displayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                checked={values.checked.includes(task.id)}
                formik={formik}
                onMarkComplete={handleMarkComplete}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <Box p={3} textAlign="center">
              <Iconify icon="eva:file-text-outline" width={48} height={48} color="text.disabled" />
              <Box mt={1}>
                No tasks found. Create your first task!
              </Box>
            </Box>
          )}
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
};

function TaskItem({ formik, task, checked, onMarkComplete, onDelete, ...other }) {
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
    onMarkComplete(task.id);
  };

  const handleShare = () => {
    handleCloseMenu();
    // TODO: Implement share functionality
    console.log('SHARE', task);
  };

  const handleEdit = () => {
    handleCloseMenu();
    // TODO: Implement edit functionality
    console.log('EDIT', task);
  };

  const handleDelete = () => {
    handleCloseMenu();
    onDelete(task.id);
  };

  return (
    <Stack
      direction="row"
      sx={{
        px: 2,
        py: 0.75,
        ...(checked && {
          color: 'text.disabled',
          textDecoration: 'line-through',
        }),
      }}
    >
      <FormControlLabel
        control={<Checkbox {...getFieldProps('checked')} value={task.id} checked={checked} {...other} />}
        label={task.label}
        sx={{ flexGrow: 1, m: 0 }}
      />

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

            <MenuItem onClick={handleShare}>
              <Iconify icon={'eva:share-fill'} />
              Share
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

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
      <IconButton size="large" color="inherit" sx={{ opacity: 0.48 }} onClick={onOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 'auto',
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
            '& svg': { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        {actions}
      </MenuPopover>
    </>
  );
}
