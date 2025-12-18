'use strict';

import { TextField } from '@mui/material';

export default function MarkInputField({
  studentId,
  totalMark,
  register,
  error,
  helperText,
}) {
  return (
    <TextField
      type="number"
      size="small"
      {...register(studentId, {
        required: 'Marks are required',
        min: {
          value: 0,
          message: 'Marks cannot be negative',
        },
        max: {
          value: totalMark || 100,
          message: `Marks cannot exceed ${totalMark || 100}`,
        },
        valueAsNumber: true,
      })}
      error={!!error}
      helperText={helperText}
      sx={{
        width: 120,
        '& .MuiOutlinedInput-input': {
          textAlign: 'center',
        },
      }}
      inputProps={{
        min: 0,
        max: totalMark || 100,
      }}
    />
  );
}

