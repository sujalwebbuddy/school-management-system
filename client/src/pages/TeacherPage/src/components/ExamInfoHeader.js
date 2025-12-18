'use strict';

import { Box, Stack, Typography, Chip } from '@mui/material';

export default function ExamInfoHeader({ selectedExamData, studentsCount }) {
  return (
    <Box
      sx={{
        p: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedExamData.name}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label={`Total Marks: ${selectedExamData.totalMark}`}
              color="primary"
              variant="outlined"
            />
            <Chip label={`Date: ${selectedExamData.dateOf || 'N/A'}`} variant="outlined" />
            <Chip label={`Students: ${studentsCount}`} variant="outlined" />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

