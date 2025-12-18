'use strict';

import { useRef, useState } from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import Iconify from './Iconify';
import api from '../../../../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { getExams } from '../../../../slices/teacherSlice';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

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

export default function ExamMoreMenu({ id, name, dateOf, totalMark }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const dispatch = useDispatch();

  const subject = useSelector((state) => {
    return state?.teacher?.userInfo?.user?.subject;
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: name || '',
      dateOf: dateOf || '',
      totalMark: totalMark || '',
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/teacher/deleteExam/${id}`);
          Swal.fire('Deleted!', 'Exam has been deleted.', 'success');
          const subjectValue =
            typeof subject === 'object' ? subject?.name || subject?._id : subject;
          dispatch(getExams(subjectValue));
        } catch (error) {
          Swal.fire('Error!', error.message || 'Failed to delete exam.', 'error');
        }
      }
    });
    setIsOpen(false);
  };

  const handleEditOpen = () => {
    reset({
      name: name || '',
      dateOf: dateOf || '',
      totalMark: totalMark || '',
    });
    setEditOpen(true);
    setIsOpen(false);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      await api.put(`/teacher/updateexam/${id}`, data);
      Swal.fire('Done!', 'Exam has been updated successfully!', 'success');
      const subjectValue =
        typeof subject === 'object' ? subject?.name || subject?._id : subject;
      dispatch(getExams(subjectValue));
      handleEditClose();
    } catch (error) {
      Swal.fire(
        'Oops!',
        error.message || 'Failed to update exam. Please try again.',
        'error'
      );
    }
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)} size="small">
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEditOpen}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Iconify
              icon="eva:trash-2-outline"
              width={24}
              height={24}
              sx={{ color: 'error.main' }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>

      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-exam-modal-title"
        aria-describedby="edit-exam-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="edit-exam-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
          >
            Edit Exam
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

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleEditClose}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                sx={{ textTransform: 'none' }}
              >
                Update
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

