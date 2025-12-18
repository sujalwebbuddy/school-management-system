'use strict';

import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Stack,
  Divider,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';
import { getHomeworks } from '../../../../slices/teacherSlice';
import { useHomeworkForm } from '../hooks/useHomeworkForm';
import HomeworkBasicFields from './HomeworkBasicFields';
import HomeworkOptionsFields from './HomeworkOptionsFields';
import HomeworkModalFooter from './HomeworkModalFooter';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function AddHomeworkModal({ open, onClose }) {
  const dispatch = useDispatch();
  const subject = useSelector((state) => {
    return state?.teacher?.userInfo?.user?.subject;
  });

  const {
    register,
    handleSubmit,
    control,
    resetForm,
    formState: { errors },
  } = useHomeworkForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/teacher/newhomework', data);
      Swal.fire('Done!', 'New Homework has been added successfully!', 'success');
      const subjectValue =
        typeof subject === 'object' ? subject?.name || subject?._id : subject;
      dispatch(getHomeworks(subjectValue || data.subject));
      handleClose();
    } catch (error) {
      Swal.fire(
        'Oops!',
        error.message || 'Failed to add homework. Please try again.',
        'error'
      );
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-homework-modal-title"
      aria-describedby="add-homework-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="add-homework-modal-title"
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
        >
          Add New Homework
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <HomeworkBasicFields register={register} control={control} errors={errors} />
          <HomeworkOptionsFields register={register} errors={errors} />

          <HomeworkModalFooter onClose={handleClose} onSubmit={handleSubmit(onSubmit)} />
        </Stack>
      </Box>
    </Modal>
  );
}

