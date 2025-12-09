import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Autocomplete,
  TextField as MuiTextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../../../../slices/taskSlice';

const priorityOptions = ['Low', 'Normal', 'High', 'Critical'];
const statusOptions = ['Open', 'InProgress', 'Testing', 'Close'];

const TaskDialog = ({ open, onClose, task = null, users = [] }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'Open',
      priority: 'Normal',
      assignee: '',
      tags: [],
      estimate: '',
      dueDate: '',
      color: '#02897B',
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const taskData = {
          ...values,
          tags: values.tags,
          estimate: values.estimate ? parseFloat(values.estimate) : undefined,
          dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
        };

        if (task) {
          // Update existing task
          await dispatch(updateTask({
            taskId: task._id,
            taskData,
          })).unwrap();
        } else {
          // Create new task
          await dispatch(createTask(taskData)).unwrap();
        }

        onClose();
      } catch (error) {
        console.error('Failed to save task:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue, resetForm } = formik;

  useEffect(() => {
    if (open) {
      if (task) {
        // Edit mode - populate form with task data
        formik.setValues({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'Open',
          priority: task.priority || 'Normal',
          assignee: task.assignee?._id || '',
          tags: task.tags || [],
          estimate: task.estimate || '',
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          color: task.color || '#02897B',
        });
      } else {
        // Create mode - reset to default values
        formik.setValues({
          title: '',
          description: '',
          status: 'Open',
          priority: 'Normal',
          assignee: '',
          tags: [],
          estimate: '',
          dueDate: '',
          color: '#02897B',
        });
      }
    }
  }, [open, task]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {task ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={values.priority}
                  onChange={handleChange}
                  label="Priority"
                >
                  {priorityOptions.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                name="assignee"
                value={values.assignee}
                onChange={handleChange}
                label="Assignee"
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={values.tags}
              onChange={(event, newValue) => {
                setFieldValue('tags', newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags..."
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Estimate (hours)"
                name="estimate"
                value={values.estimate}
                onChange={handleChange}
                error={touched.estimate && Boolean(errors.estimate)}
                helperText={touched.estimate && errors.estimate}
                inputProps={{ min: 0, step: 0.5 }}
              />

              <TextField
                fullWidth
                type="date"
                label="Due Date"
                name="dueDate"
                value={values.dueDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <TextField
              fullWidth
              type="color"
              label="Color"
              name="color"
              value={values.color}
              onChange={handleChange}
              sx={{ maxWidth: 200 }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

TaskDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object,
  users: PropTypes.array,
};

export default TaskDialog;
