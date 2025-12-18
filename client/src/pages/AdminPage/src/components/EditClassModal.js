'use strict';

import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { getClasses } from '../../../../slices/adminSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function EditClassModal({ open, onClose, classData }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (classData) {
      reset({ className: classData.className || classData.classesName || '' });
    }
  }, [classData, reset]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/admin/class/update/${classData._id}`, data);
      Swal.fire({
        title: 'Success!',
        text: 'Class has been updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      dispatch(getClasses());
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to update class';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
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
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
        >
          Update Class
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Class Name"
              variant="outlined"
              fullWidth
              {...register('className', { required: 'Class name is required' })}
              error={!!errors.className}
              helperText={errors.className?.message}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleClose}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ textTransform: 'none' }}
              >
                Update
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

