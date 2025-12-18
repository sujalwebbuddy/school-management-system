'use strict';

import { useRef, useState } from 'react';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Iconify from './Iconify';
import api from '../../../../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeworks } from '../../../../slices/teacherSlice';
import Swal from 'sweetalert2';

export default function HomeworkMoreMenu({ homeworkId }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const subject = useSelector((state) => {
    return state?.teacher?.userInfo?.user?.subject;
  });

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
        await api.delete(`/teacher/delete/${homeworkId}`);
        Swal.fire('Deleted!', 'Homework has been deleted.', 'success');
        const subjectValue =
          typeof subject === 'object' ? subject?.name || subject?._id : subject;
        dispatch(getHomeworks(subjectValue));
      } catch (error) {
        Swal.fire('Error!', error.message || 'Failed to delete homework.', 'error');
      }
    }
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

