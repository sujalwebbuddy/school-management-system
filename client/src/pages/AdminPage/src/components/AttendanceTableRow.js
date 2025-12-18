'use strict';

import { TableRow, TableCell, Stack, Avatar, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
};

export default function AttendanceTableRow({ user, attendanceStatus, onStatusChange, role }) {
  const name = `${user.firstName} ${user.lastName}`;

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      onStatusChange(user._id, newStatus);
    }
  };

  const classInfo = role === 'student' ? (user.classIn?.className || user.classIn || 'N/A') : null;
  const subjectInfo = role === 'teacher' ? (user.subject?.name || user.subject || 'N/A') : null;

  return (
    <TableRow
      hover
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <TableCell component="th" scope="row">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={name} src={user.profileImage} sx={{ width: 40, height: 40 }} />
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" color="text.secondary">
          {user.email || 'N/A'}
        </Typography>
      </TableCell>
      {role === 'student' && (
        <TableCell align="left">
          <Typography variant="body2" color="text.secondary">
            {classInfo}
          </Typography>
        </TableCell>
      )}
      {role === 'teacher' && (
        <TableCell align="left">
          <Typography variant="body2" color="text.secondary">
            {subjectInfo}
          </Typography>
        </TableCell>
      )}
      <TableCell align="center">
        <ToggleButtonGroup
          value={attendanceStatus}
          exclusive
          onChange={handleStatusChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 2,
              py: 0.5,
              fontWeight: 600,
            },
          }}
        >
          <ToggleButton
            value={ATTENDANCE_STATUS.PRESENT}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'success.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'success.dark',
                },
              },
            }}
          >
            <CheckCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Present
          </ToggleButton>
          <ToggleButton
            value={ATTENDANCE_STATUS.ABSENT}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'error.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'error.dark',
                },
              },
            }}
          >
            <CancelIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Absent
          </ToggleButton>
        </ToggleButtonGroup>
      </TableCell>
    </TableRow>
  );
}

