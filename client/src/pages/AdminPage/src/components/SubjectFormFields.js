'use strict';

import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Controller } from 'react-hook-form';

export default function SubjectFormFields({ register, control, errors, classes }) {
  return (
    <Stack spacing={3}>
      <FormControl fullWidth error={!!errors.classname}>
        <InputLabel id="class-select-label">Class Name</InputLabel>
        <Controller
          name="classname"
          control={control}
          rules={{ required: 'Class name is required' }}
          render={({ field }) => (
            <Select
              {...field}
              labelId="class-select-label"
              id="class-select"
              label="Class Name"
            >
              {classes && classes.length > 0 ? (
                classes.map((classroom) => {
                  const className = classroom.className || classroom.classesName || '';
                  const classId = classroom._id || '';
                  return (
                    <MenuItem key={classId} value={className}>
                      {className}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem value="" disabled>
                  No classes available
                </MenuItem>
              )}
            </Select>
          )}
        />
        {errors.classname && (
          <FormHelperText>{errors.classname.message || 'Class name is required'}</FormHelperText>
        )}
      </FormControl>

      <TextField
        label="Subject Name"
        variant="outlined"
        fullWidth
        {...register('subjectName', { required: 'Subject name is required' })}
        error={!!errors.subjectName}
        helperText={errors.subjectName?.message}
      />
    </Stack>
  );
}

