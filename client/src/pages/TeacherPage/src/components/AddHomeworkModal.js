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
import { useTheme } from '@mui/material/styles';
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
  width: { xs: '95%', md: 800 },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  overflow: 'hidden', // Hide overflow from corners
  p: 0, // Reset padding
  outline: 'none',
};

export default function AddHomeworkModal({ open, onClose }) {
  const dispatch = useDispatch();
  const theme = useTheme();
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

  const gradientBackground = theme?.palette?.gradients?.primary || `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-homework-modal-title"
      aria-describedby="add-homework-modal-description"
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            py: 2.5,
            px: 3,
            background: gradientBackground,
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            id="add-homework-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: 700 }}
          >
            Add New Homework
          </Typography>
        </Box>

        <Box sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 2, display: 'block' }}>
                Basic Information
              </Typography>
              <HomeworkBasicFields register={register} control={control} errors={errors} />
            </Box>

            <Divider dashed />

            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 2, display: 'block' }}>
                Question Configuration
              </Typography>
              <HomeworkOptionsFields register={register} errors={errors} />
            </Box>

            <Box sx={{ pt: 1 }}>
              <HomeworkModalFooter onClose={handleClose} onSubmit={handleSubmit(onSubmit)} />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

