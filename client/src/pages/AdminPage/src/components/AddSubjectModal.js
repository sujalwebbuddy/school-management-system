'use strict';

import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { getClasses } from '../../../../slices/adminSlice';
import SubjectFormFields from './SubjectFormFields';

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

export default function AddSubjectModal({ open, onClose, classes }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/admin/newsubject', data);
      Swal.fire({
        title: 'Success!',
        text: 'Subject has been assigned to the class successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-popup-custom',
        },
      });
      dispatch(getClasses());
      reset({ classname: '', subjectName: '' });
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to assign subject';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      reset({ subjectName: '' });
    }
  };

  const handleClose = () => {
    reset({ classname: '', subjectName: '' });
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
          Assign Subject
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>
          Add a new subject to a specific class.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <SubjectFormFields
            register={register}
            control={control}
            errors={errors}
            classes={classes}
          />

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
              Assign
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

