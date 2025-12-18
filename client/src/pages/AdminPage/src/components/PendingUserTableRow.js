'use strict';

import { TableRow, TableCell, Stack, Avatar, Typography, Checkbox } from '@mui/material';
import Label from '../components/Label';
import PendingUserMoreMenu from './PendingUserMoreMenu';

export default function PendingUserTableRow({ user, isItemSelected, onSelect }) {
  const { _id, firstName, lastName, role, email, phoneNumber, isApproved, profileImage } = user;
  const name = `${firstName} ${lastName}`;

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
      <TableCell padding="checkbox">
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
          {role}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" color="text.secondary">
          {phoneNumber || 'N/A'}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Label
          variant="ghost"
          color={isApproved === false ? 'error' : 'success'}
        >
          {isApproved ? 'Approved' : 'Pending'}
        </Label>
      </TableCell>
      <TableCell align="right">
        <PendingUserMoreMenu
          id={_id}
          role={role}
          userData={{ firstName, lastName, email, phoneNumber }}
        />
      </TableCell>
    </TableRow>
  );
}

