'use strict';

import { Stack, TextField, MenuItem, Grid } from '@mui/material';

export default function HomeworkOptionsFields({ register, errors }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Option A"
          variant="outlined"
          fullWidth
          {...register('optionA', { required: 'Option A is required' })}
          error={!!errors.optionA}
          helperText={errors.optionA?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Option B"
          variant="outlined"
          fullWidth
          {...register('optionB', { required: 'Option B is required' })}
          error={!!errors.optionB}
          helperText={errors.optionB?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Option C"
          variant="outlined"
          fullWidth
          {...register('optionC', { required: 'Option C is required' })}
          error={!!errors.optionC}
          helperText={errors.optionC?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Option D"
          variant="outlined"
          fullWidth
          {...register('optionD', { required: 'Option D is required' })}
          error={!!errors.optionD}
          helperText={errors.optionD?.message}
        />
      </Grid>

      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
}

