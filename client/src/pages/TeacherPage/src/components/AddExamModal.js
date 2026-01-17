'use strict';

import React from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from '@mui/material';
import {
  AssignmentOutlined,
  EventOutlined,
  GradeOutlined,
  BookOutlined, // Kept import, although not strictly used in select startAdornment in previous code, good to have if we enhance select
  SchoolOutlined, // Kept import
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';
import { getExams } from '../../../../slices/teacherSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 650 }, // Increased width
  bgcolor: '#ffffff',
  borderRadius: 3,
  boxShadow: '0 24px 48px -12px rgba(16, 24, 40, 0.25)',
  p: 4,
  outline: 'none',
};

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

const AddExamModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  // Logic from SubjectSelect
  const subjectRaw = useSelector((state) => state?.teacher?.userInfo?.user?.subject);
  const subjects = React.useMemo(() => {
    if (!subjectRaw) return [];
    if (Array.isArray(subjectRaw)) {
      return subjectRaw.map((sub) => (typeof sub === 'object' ? sub?.name || sub?._id : sub));
    }
    if (typeof subjectRaw === 'object') {
      return [subjectRaw?.name || subjectRaw?._id];
    }
    return [subjectRaw];
  }, [subjectRaw]);

  // Logic from ClassNameSelect
  const classList = useSelector((state) => state.teacher?.classrooms?.classes || []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      dateOf: '',
      totalMark: '',
      subject: '',
      classname: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/teacher/newexam', data);
      Swal.fire({
        title: 'Success!',
        text: 'New Exam has been added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-popup-custom',
        },
      });
      const subjectValue = typeof subjectRaw === 'object' ? subjectRaw?.name || subjectRaw?._id : subjectRaw;
      dispatch(getExams(subjectValue || data.subject));
      handleClose();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to add exam. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleClose = () => {
    reset({
      name: '',
      dateOf: '',
      totalMark: '',
      subject: '',
      classname: '',
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#101828' }}
        >
          Add New Exam
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
          Schedule a new exam for your class.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Exam Name */}
            <Box>
              <Typography variant="subtitle2" sx={labelSx}>Exam Name</Typography>
              <TextField
                placeholder="e.g. Midterm Physics"
                variant="outlined"
                fullWidth
                {...register('name', { required: 'Exam name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
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

            {/* Row: Date & Marks */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={labelSx}>Exam Date</Typography>
                <TextField
                  type="date"
                  fullWidth
                  {...register('dateOf', { required: 'Exam date is required' })}
                  error={!!errors.dateOf}
                  helperText={errors.dateOf?.message}
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
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={labelSx}>Total Marks</Typography>
                <TextField
                  type="number"
                  placeholder="100"
                  variant="outlined"
                  fullWidth
                  {...register('totalMark', {
                    required: 'Total marks is required',
                    min: { value: 1, message: 'Marks must be greater than 0' },
                  })}
                  error={!!errors.totalMark}
                  helperText={errors.totalMark?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GradeOutlined sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                    sx: commonInputSx,
                  }}
                />
              </Box>
            </Stack>

            {/* Row: Subject & Class */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={labelSx}>Subject</Typography>
                <FormControl fullWidth error={!!errors.subject}>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: 'Subject is required' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        sx={commonInputSx}
                      >
                        <MenuItem value="" disabled>Select Subject</MenuItem>
                        {subjects && subjects.length > 0 ? (
                          subjects.map((sub, index) => (
                            <MenuItem key={index} value={sub}>{sub}</MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" disabled>No subject available</MenuItem>
                        )}
                      </Select>
                    )}
                  />
                  {errors.subject && (
                    <FormHelperText>{errors.subject.message}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={labelSx}>Class Name</Typography>
                <FormControl fullWidth error={!!errors.classname}>
                  <Controller
                    name="classname"
                    control={control}
                    rules={{ required: 'Class name is required' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        displayEmpty
                        sx={commonInputSx}
                      >
                        <MenuItem value="" disabled>Select Class</MenuItem>
                        {classList && classList.length > 0 ? (
                          classList.map((classItem) => {
                            const className = classItem.className || classItem.classesName || '';
                            const classId = classItem._id || '';
                            return (
                              <MenuItem key={classId} value={className}>
                                {className}
                              </MenuItem>
                            );
                          })
                        ) : (
                          <MenuItem value="" disabled>No classes available</MenuItem>
                        )}
                      </Select>
                    )}
                  />
                  {errors.classname && (
                    <FormHelperText>{errors.classname.message}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
              <Button
                variant="text"
                color="inherit"
                onClick={handleClose}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 1,
                  color: 'text.secondary',
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 1.5,
                  px: 4,
                  boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.24)',
                  background: 'linear-gradient(to right, #2563EB, #4F46E5)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #1D4ED8, #4338CA)',
                    boxShadow: '0 12px 24px -6px rgba(37, 99, 235, 0.4)',
                  },
                }}
              >
                Create Exam
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddExamModal;

