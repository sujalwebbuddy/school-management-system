'use strict';

import React from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../../../utils/api';
import Swal from 'sweetalert2';
import { getExams } from '../../../../slices/teacherSlice';
import SubjectSelect from '../../../../components/SubjectSelect';
import ClassNameSelect from '../../../../components/ClassNameSelect';

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

const AddExamModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const subject = useSelector((state) => {
    return state?.teacher?.userInfo?.user?.subject;
  });

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
      Swal.fire('Done!', 'New Exam has been added successfully!', 'success');
      const subjectValue =
        typeof subject === 'object' ? subject?.name || subject?._id : subject;
      dispatch(getExams(subjectValue || data.subject));
      handleClose();
    } catch (error) {
      Swal.fire(
        'Oops!',
        error.message || 'Failed to add exam. Please try again.',
        'error'
      );
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
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
        >
          Add New Exam
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <TextField
            label="Exam Name"
            variant="outlined"
            fullWidth
            {...register('name', { required: 'Exam name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Exam Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            {...register('dateOf', { required: 'Exam date is required' })}
            error={!!errors.dateOf}
            helperText={errors.dateOf?.message}
          />

          <TextField
            label="Total Marks"
            type="number"
            variant="outlined"
            fullWidth
            {...register('totalMark', {
              required: 'Total marks is required',
              min: { value: 1, message: 'Marks must be greater than 0' },
            })}
            error={!!errors.totalMark}
            helperText={errors.totalMark?.message}
          />

          <SubjectSelect control={control} errors={errors} role="teacher" />
          <ClassNameSelect control={control} errors={errors} role="teacher" />

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
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{ textTransform: 'none' }}
            >
              Create Exam
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddExamModal;

