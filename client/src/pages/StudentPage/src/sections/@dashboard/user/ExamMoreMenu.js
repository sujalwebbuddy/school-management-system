'use strict';

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Iconify from '../../../components/Iconify';

export default function ExamMoreMenu({ id }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
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
        <Link
          to={`/studentDashboard/examdetails/${id}`}
          state={id}
          style={{ textDecoration: 'none' }}
        >
          <MenuItem sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="carbon:view" width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="View Details"
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        </Link>
      </Menu>
    </>
  );
}

