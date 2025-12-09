'use strict';

import React from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert';
import { getExams } from '../../../../slices/teacherSlice';
import SubjectSelect from '../../../../components/SubjectSelect';
import ClassNameSelect from '../../../../components/ClassNameSelect';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const AddExamModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
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
      await axios.post('/api/v1/teacher/newexam', data);
      await swal('Done!', 'New Exam has been added successfully !', 'success');
      dispatch(getExams(data.subject));
      handleClose();
      reset();
    } catch (err) {
      swal('Oops!', err.response?.data?.msg || 'An error occurred', 'error');
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
          style={{ textAlign: 'center', color: '#DB7093' }}
        >
          Add New Exam
        </Typography>
        <hr></hr>
        <TextField
          id="outlined-basic"
          label="Exam name"
          variant="outlined"
          style={{ width: '100%', marginTop: '16px' }}
          {...register('name', { required: true })}
        />
        <p style={{ color: 'red', textAlign: 'center', margin: '4px 0' }}>
          {errors.name?.type === 'required' && 'Exam Name is required'}
        </p>
        <TextField
          id="date"
          label="Exam's date"
          type="date"
          style={{ width: '100%', marginTop: '16px' }}
          InputLabelProps={{
            shrink: true,
          }}
          {...register('dateOf', { required: true })}
        />
        <p style={{ color: 'red', textAlign: 'center', margin: '4px 0' }}>
          {errors.dateOf?.type === 'required' && "Exam's date is required"}
        </p>
        <TextField
          id="outlined-basic"
          label="Total Marks"
          variant="outlined"
          type="number"
          style={{ width: '100%', marginTop: '16px' }}
          {...register('totalMark', { required: true })}
        />
        <p style={{ color: 'red', textAlign: 'center', margin: '4px 0' }}>
          {errors.totalMark?.type === 'required' && 'Total Mark is required'}
        </p>
        <SubjectSelect 
          control={control} 
          errors={errors} 
          role="teacher"
        />
        <ClassNameSelect 
          control={control} 
          errors={errors} 
          role="teacher"
        />
        <hr style={{ border: 'none', marginTop: '16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddExamModal;

