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
  mb: 0.75,
  fontWeight: 600,
  color: 'text.primary',
  fontSize: '0.8125rem',
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 24px 48px -12px rgba(16, 24, 40, 0.25)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Fixed Header */}
        <Box sx={{ p: 2.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#101828', mb: 0.5 }}>
            {task ? 'Edit Task' : 'Create New Task'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
            {task ? 'Modify task details below' : 'Fill in the details to create a new task'}
          </Typography>
        </Box>

        {/* Scrollable Content */}
        <DialogContent sx={{ p: 2.5, flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: '3px' } }}>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={labelSx}>Title</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Task title"
                name="title"
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentOutlined sx={{ color: 'text.disabled', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: commonInputSx,
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={labelSx}>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                placeholder="Describe the task..."
                name="description"
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                InputProps={{
                  sx: { ...commonInputSx, alignItems: 'flex-start', py: 1 },
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 0.5 }}>
                      <DescriptionOutlined sx={{ color: 'text.disabled', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Status & Priority Row */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={labelSx}>Status</Typography>
              <FormControl fullWidth size="small">
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={labelSx}>Priority</Typography>
              <FormControl fullWidth size="small">
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
            </Grid>

            {/* Assignee & Tags Row */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={labelSx}>Assignee</Typography>
              <FormControl fullWidth size="small">
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
            </Grid>
            <Grid item xs={12} sm={6}>
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
                    size="small"
                    placeholder={values.tags.length === 0 ? "Add tags..." : ""}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LabelOutlined sx={{ color: 'text.disabled', fontSize: 18 }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      sx: commonInputSx,
                    }}
                  />
                )}
              />
            </Grid>

            {/* Estimate, Due Date & Label Color Row */}
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" sx={labelSx}>Estimate (Hours)</Typography>
              <TextField
                fullWidth
                size="small"
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
                      <AccessTimeOutlined sx={{ color: 'text.disabled', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: commonInputSx,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" sx={labelSx}>Due Date</Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                name="dueDate"
                value={values.dueDate}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventOutlined sx={{ color: 'text.disabled', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: commonInputSx,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" sx={labelSx}>Label Color</Typography>
              <TextField
                type="color"
                fullWidth
                size="small"
                name="color"
                value={values.color}
                onChange={handleChange}
                sx={{
                  ...commonInputSx,
                  padding: 0,
                  '& input': { cursor: 'pointer', height: 36, padding: '4px' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <PaletteOutlined sx={{ color: 'text.disabled', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 1.5 }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* Fixed Footer */}
        <Box sx={{ p: 2.5, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            color="inherit"
            sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'none', minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              fontWeight: 600,
              borderRadius: 1.5,
              px: 2.5,
              textTransform: 'none',
              boxShadow: '0 4px 12px -2px rgba(37, 99, 235, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px -4px rgba(37, 99, 235, 0.3)',
              },
            }}
          >
            {loading ? 'Saving...' : (task ? 'Update' : 'Create')}
          </Button>
        </Box>
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
