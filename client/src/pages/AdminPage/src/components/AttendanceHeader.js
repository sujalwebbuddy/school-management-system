'use strict';

import { Stack, Typography, Chip } from '@mui/material';
import Iconify from './Iconify';

export default function AttendanceHeader({ selectedDate, presentCount, absentCount, totalCount }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Attendance for {selectedDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip
          icon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          label={`Present: ${presentCount}`}
          color="success"
          variant="outlined"
        />
        <Chip
          icon={<Iconify icon="eva:close-circle-2-fill" />}
          label={`Absent: ${absentCount}`}
          color="error"
          variant="outlined"
        />
        <Chip
          label={`Total: ${totalCount}`}
          color="primary"
          variant="outlined"
        />
      </Stack>
    </Stack>
  );
}

