import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Box,
  Autocomplete,
  TextField as MuiTextField,
  Typography,
  Stack,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  AssignmentOutlined,
  DescriptionOutlined,
  AccessTimeOutlined,
  EventOutlined,
  LabelOutlined,
  PaletteOutlined,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../../../slices/taskSlice';

const priorityOptions = ['Low', 'Normal', 'High', 'Critical'];
const statusOptions = ['Open', 'InProgress', 'Testing', 'Close'];

const commonInputSx = {
  borderRadius: 1.5,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(145, 158, 171, 0.32)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'text.primary',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
    borderWidth: 2,
  },
};

const labelSx = {
  mb: 1,
  fontWeight: 600,
  color: 'text.primary',
  fontSize: '0.875rem',
};

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px -12px rgba(16, 24, 40, 0.25)',
          overflow: 'visible',
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 1, color: '#101828' }}>
          {task ? 'Edit Task' : 'Create New Task'}
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 4 }}>
          {task ? 'Modify task details below' : 'Fill in the details to create a new task'}
        </Typography>

        <DialogContent sx={{ p: 0, overflowY: 'visible' }}>
          <Stack spacing={3}>
            {/* Title */}
            <Box>
              <Typography variant="subtitle2" sx={labelSx}>Title</Typography>
              <TextField
                fullWidth
                placeholder="Task title"
                name="title"
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentOutlined sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  sx: commonInputSx,
                }}
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography variant="subtitle2" sx={labelSx}>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Describe the task..."
                name="description"
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                InputProps={{
                  sx: { ...commonInputSx, alignItems: 'flex-start', py: 1.5 },
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 0.5 }}>
                      <DescriptionOutlined sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Status & Priority Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={labelSx}>Status</Typography>
                <FormControl fullWidth>
                  <Select
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    displayEmpty
                    sx={commonInputSx}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={labelSx}>Priority</Typography>
                <FormControl fullWidth>
                  <Select
                    name="priority"
                    value={values.priority}
                    onChange={handleChange}
                    displayEmpty
                    sx={commonInputSx}
                  >
                    {priorityOptions.map((priority) => (
                      <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {/* Assignee */}
            <Box>
              <Typography variant="subtitle2" sx={labelSx}>Assignee</Typography>
              <FormControl fullWidth>
                <Select
                  name="assignee"
                  value={values.assignee}
                  onChange={handleChange}
                  displayEmpty
                  sx={commonInputSx}
                >
                  <MenuItem value="">
                    <span style={{ color: '#919EAB' }}>Unassigned</span>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Tags (Autocomplete) */}
            <Box>
              <Typography variant="subtitle2" sx={labelSx}>Tags</Typography>
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
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" />
                  ))
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    placeholder={values.tags.length === 0 ? "Add tags..." : ""}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LabelOutlined sx={{ color: 'text.disabled' }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      sx: commonInputSx,
                    }}
                  />
                )}
              />
            </Box>

            {/* Estimate & Due Date Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={labelSx}>Estimate (Hours)</Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="0.0"
                  name="estimate"
                  value={values.estimate}
                  onChange={handleChange}
                  error={touched.estimate && Boolean(errors.estimate)}
                  helperText={touched.estimate && errors.estimate}
                  inputProps={{ min: 0, step: 0.5 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeOutlined sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                    sx: commonInputSx,
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={labelSx}>Due Date</Typography>
                <TextField
                  fullWidth
                  type="date"
                  name="dueDate"
                  value={values.dueDate}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventOutlined sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                    sx: commonInputSx,
                  }}
                />
              </Box>
            </Stack>

            {/* Color Picker */}
            <Box>
              <Typography variant="subtitle2" sx={labelSx}>Label Color</Typography>
              <TextField
                type="color"
                fullWidth
                name="color"
                value={values.color}
                onChange={handleChange}
                sx={{
                  ...commonInputSx,
                  padding: 0,
                  '& input': { cursor: 'pointer', height: 40, padding: '4px' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <PaletteOutlined sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 1.5 }
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            color="inherit"
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              fontWeight: 700,
              borderRadius: 1.5,
              px: 3,
              boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.24)',
              background: 'linear-gradient(to right, #2563EB, #4F46E5)',
              '&:hover': {
                background: 'linear-gradient(to right, #1D4ED8, #4338CA)',
                boxShadow: '0 12px 24px -6px rgba(37, 99, 235, 0.4)',
              },
            }}
          >
            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </Button>
        </Stack>
      </Box>
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
