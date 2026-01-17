'use strict';

import { TextField, Stack, Grid } from '@mui/material';
import SubjectSelect from '../../../../components/SubjectSelect';
import ClassNameSelect from '../../../../components/ClassNameSelect';

export default function HomeworkBasicFields({ register, control, errors }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Homework Name"
          variant="outlined"
          fullWidth
          {...register('name', { required: 'Homework name is required' })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          {...register('dateOf', { required: 'Due date is required' })}
          error={!!errors.dateOf}
          helperText={errors.dateOf?.message}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <SubjectSelect control={control} errors={errors} role="teacher" />
      </Grid>

      <Grid item xs={12} sm={6}>
        <ClassNameSelect control={control} errors={errors} role="teacher" />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Homework Description"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          {...register('description', { required: 'Description is required' })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Grid>
    </Grid>
  );
}

