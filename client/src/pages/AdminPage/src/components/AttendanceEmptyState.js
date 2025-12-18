'use strict';

import { Box, Typography } from '@mui/material';
import Iconify from './Iconify';

export default function AttendanceEmptyState() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        color: 'text.secondary',
      }}
    >
      <Iconify icon="eva:calendar-outline" sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        Select a Date
      </Typography>
      <Typography variant="body2">
        Please select a date to begin marking attendance
      </Typography>
    </Box>
  );
}

