'use strict';

import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import { SchoolOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { getClasses } from '../../../../slices/adminSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 480 },
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

export default function AddClassModal({ open, onClose }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/admin/newclass', data);
      Swal.fire({
        title: 'Success!',
        text: 'New class has been added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-popup-custom', // If you have custom swal styles
        },
      });
      dispatch(getClasses());
      reset({ className: '' });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to add class';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      reset({ className: '' });
    }
  };

  const handleClose = () => {
    reset({ className: '' });
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
          Add New Class
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
          Create a new class for students to join.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                Class Name
              </Typography>
              <TextField
                placeholder="e.g. Class 10 A"
                variant="outlined"
                fullWidth
                {...register('className', { required: 'Class name is required' })}
                error={!!errors.className}
                helperText={errors.className?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolOutlined sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  sx: commonInputSx,
                }}
              />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
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
                Add Class
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

