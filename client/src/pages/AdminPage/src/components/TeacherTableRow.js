'use strict';

import { TableRow, TableCell, Stack, Avatar, Typography, Chip, Checkbox } from '@mui/material';
import TeacherMoreMenu from './TeacherMoreMenu';

export default function TeacherTableRow({ teacher, isItemSelected, onSelect }) {
  const { _id, firstName, lastName, email, phoneNumber, subject, profileImage, gender } = teacher;
  const name = `${firstName} ${lastName}`;
  
  let subjectName = 'N/A';
  if (subject) {
    if (typeof subject === 'object' && subject.name) {
      subjectName = subject.name;
    } else if (typeof subject === 'string') {
      subjectName = subject;
    }
  }

  return (
    <TableRow
      hover
      key={_id}
      tabIndex={-1}
      role="checkbox"
      selected={isItemSelected}
      aria-checked={isItemSelected}
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <TableCell padding="checkbox" sx={{ width: 48 }}>
        <Checkbox
          checked={isItemSelected}
          onChange={(event) => onSelect(event, name)}
        />
      </TableCell>
      <TableCell component="th" scope="row" padding="none">
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 2 }}>
          <Avatar alt={name} src={profileImage} sx={{ width: 40, height: 40 }} />
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" color="text.secondary">
          {gender || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" color="text.secondary">
          {phoneNumber || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Chip label={subjectName} size="small" variant="outlined" />
      </TableCell>
      <TableCell align="right">
        <TeacherMoreMenu teacherId={_id} teacher={teacher} />
      </TableCell>
    </TableRow>
  );
}

