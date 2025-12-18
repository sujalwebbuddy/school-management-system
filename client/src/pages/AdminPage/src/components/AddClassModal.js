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
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
        >
          Add New Class
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
                Add Class
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

