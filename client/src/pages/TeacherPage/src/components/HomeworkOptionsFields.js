'use strict';

import { Stack, TextField, MenuItem } from '@mui/material';

export default function HomeworkOptionsFields({ register, errors }) {
  return (
    <>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <TextField
          label="Option A"
          variant="outlined"
          sx={{ flex: 1, minWidth: { xs: '100%', sm: '45%' } }}
          {...register('optionA', { required: 'Option A is required' })}
          error={!!errors.optionA}
          helperText={errors.optionA?.message}
        />
        <TextField
          label="Option B"
          variant="outlined"
          sx={{ flex: 1, minWidth: { xs: '100%', sm: '45%' } }}
          {...register('optionB', { required: 'Option B is required' })}
          error={!!errors.optionB}
          helperText={errors.optionB?.message}
        />
        <TextField
          label="Option C"
          variant="outlined"
          sx={{ flex: 1, minWidth: { xs: '100%', sm: '45%' } }}
          {...register('optionC', { required: 'Option C is required' })}
          error={!!errors.optionC}
          helperText={errors.optionC?.message}
        />
        <TextField
          label="Option D"
          variant="outlined"
          sx={{ flex: 1, minWidth: { xs: '100%', sm: '45%' } }}
          {...register('optionD', { required: 'Option D is required' })}
          error={!!errors.optionD}
          helperText={errors.optionD?.message}
        />
      </Stack>

      <TextField
        select
        label="Correct Answer"
        fullWidth
        {...register('correct', { required: 'Correct answer is required' })}
        error={!!errors.correct}
        helperText={errors.correct?.message}
      >
        <MenuItem value="A">A</MenuItem>
        <MenuItem value="B">B</MenuItem>
        <MenuItem value="C">C</MenuItem>
        <MenuItem value="D">D</MenuItem>
      </TextField>
    </>
  );
}

