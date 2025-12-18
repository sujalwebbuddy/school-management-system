'use strict';

import { FormControl, InputLabel, Select, MenuItem, Stack, Chip, Typography } from '@mui/material';

export default function ExamSelector({ exams, selectedExam, onChange }) {
  return (
    <FormControl sx={{ minWidth: { xs: '100%', sm: 300 } }}>
      <InputLabel id="exam-select-label">Select Exam</InputLabel>
      <Select
        labelId="exam-select-label"
        id="exam-select"
        value={selectedExam}
        label="Select Exam"
        onChange={onChange}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
        }}
      >
        {exams.length === 0 ? (
          <MenuItem disabled>No exams available</MenuItem>
        ) : (
          exams.map((exam, index) => (
            <MenuItem key={exam._id || index} value={exam.name}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>{exam.name}</Typography>
                <Chip label={`${exam.totalMark} marks`} size="small" variant="outlined" />
              </Stack>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

