'use strict';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../../../utils/api';
import { useDispatch } from 'react-redux';
import { getClasses } from '../../../../slices/adminSlice';
import Swal from 'sweetalert2';

export default function ClassCardActions({ classId, onEdit }) {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/class/${classId}`);
        Swal.fire('Deleted!', 'Class has been deleted.', 'success');
        dispatch(getClasses());
      } catch (error) {
        Swal.fire('Error!', error.message || 'Failed to delete class.', 'error');
      }
    }
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={onEdit}
        sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={handleDelete}
        sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </>
  );
}

