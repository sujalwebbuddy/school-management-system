'use strict';

import { TextField, Stack } from '@mui/material';
import SubjectSelect from '../../../../components/SubjectSelect';
import ClassNameSelect from '../../../../components/ClassNameSelect';

export default function HomeworkBasicFields({ register, control, errors }) {
  return (
    <Stack spacing={3}>
      <TextField
        label="Homework Name"
        variant="outlined"
        fullWidth
        {...register('name', { required: 'Homework name is required' })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

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

      <SubjectSelect control={control} errors={errors} role="teacher" />
      <ClassNameSelect control={control} errors={errors} role="teacher" />

      <TextField
        label="Homework Description"
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        {...register('description', { required: 'Description is required' })}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
    </Stack>
  );
}

