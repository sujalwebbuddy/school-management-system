'use strict';

import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  Divider,
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
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
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
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
        >
          Assign Subject to Class
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <SubjectFormFields
            register={register}
            control={control}
            errors={errors}
            classes={classes}
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
              Assign
            </Button>
          </Stack>
        </Box>
      </Box>    
    </Modal> 
  );
}

