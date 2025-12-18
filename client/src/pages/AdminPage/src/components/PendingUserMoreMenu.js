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
import { getNoApprovedUsers } from '../../../../slices/adminSlice';
import Swal from 'sweetalert2';

export default function PendingUserMoreMenu({ id, role, userData }) {
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
        await api.delete(`/admin/deleteUser/${id}`);
        Swal.fire('Deleted!', 'User request has been deleted.', 'success');
        dispatch(getNoApprovedUsers());
      } catch (error) {
        Swal.fire('Error!', error.message || 'Failed to delete user.', 'error');
      }
    }
    setIsOpen(false);
  };

  const handleApprove = () => {
    const route = role === 'teacher' ? '/dashboard/newusert' : '/dashboard/newuser';
    navigate(route, { state: { userData, isApproval: true } });
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
        <MenuItem sx={{ color: 'primary.main' }} onClick={handleApprove}>
          <ListItemIcon>
            <Iconify icon="eva:checkmark-circle-2-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Approve"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={handleDelete}>
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

