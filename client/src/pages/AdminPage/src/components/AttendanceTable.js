'use strict';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from '@mui/material';
import Scrollbar from './Scrollbar';
import AttendanceTableRow from './AttendanceTableRow';

const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
};

export default function AttendanceTable({ users, attendanceData, onAttendanceChange, role }) {
  if (!users || users.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
          No {role === 'teacher' ? 'Teachers' : 'Students'} Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please ensure {role === 'teacher' ? 'teachers' : 'students'} are added to the system
        </Typography>
      </Box>
    );
  }

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: 'action.selected',
              }}
            >
              <TableCell sx={{ fontWeight: 600 }}>
                {role === 'teacher' ? 'Teacher Name' : 'Student Name'}
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 600 }}>
                Email
              </TableCell>
              {role === 'student' && (
                <TableCell align="left" sx={{ fontWeight: 600 }}>
                  Class
                </TableCell>
              )}
              {role === 'teacher' && (
                <TableCell align="left" sx={{ fontWeight: 600 }}>
                  Subject
                </TableCell>
              )}
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <AttendanceTableRow
                key={user._id}
                user={user}
                attendanceStatus={attendanceData[user._id] || ATTENDANCE_STATUS.PRESENT}
                onStatusChange={onAttendanceChange}
                role={role}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}

