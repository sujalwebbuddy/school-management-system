'use strict';

import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function ClassSelect({ control, errors, classrooms }) {
  return (
    <FormControl fullWidth error={!!errors.classIn} sx={{ mt: 2 }}>
      <InputLabel id="class-label">Class</InputLabel>
      <Controller
        name="classIn"
        control={control}
        rules={{ required: 'Class is required' }}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value || ''}
            labelId="class-label"
            id="class-select"
            label="Class"
          >
            <MenuItem value="" disabled>
              Select classroom
            </MenuItem>
            {classrooms && classrooms.length > 0 ? (
              classrooms.map((classroom) => {
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
      {errors.classIn && (
        <FormHelperText>{errors.classIn.message || 'Class is required'}</FormHelperText>
      )}
    </FormControl>
  );
}

