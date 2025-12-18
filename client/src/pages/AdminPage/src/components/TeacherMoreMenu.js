'use strict';

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Iconify from './Iconify';
import api from '../../../../utils/api';
import { useDispatch } from 'react-redux';
import { getApprovedUsers } from '../../../../slices/adminSlice';
import Swal from 'sweetalert2';

export default function TeacherMoreMenu({ teacherId, teacher }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        await api.delete(`/admin/user/${teacherId}`);
        Swal.fire('Deleted!', 'Teacher has been deleted.', 'success');
        dispatch(getApprovedUsers());
      } catch (error) {
        Swal.fire('Error!', error.message || 'Failed to delete teacher.', 'error');
      }
    }
    setIsOpen(false);
  };

  const handleView = () => {
    navigate(`/dashboard/${teacherId}`, { state: teacherId });
    setIsOpen(false);
  };

  const handleEdit = () => {
    navigate(`/dashboard/teachers/profile/${teacherId}`, { state: teacherId });
    setIsOpen(false);
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
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <Iconify icon="eva:eye-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="View"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
        <MenuItem onClick={handleEdit}>
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
    </>
  );
}

