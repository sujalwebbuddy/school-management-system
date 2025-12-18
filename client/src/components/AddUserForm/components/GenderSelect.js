'use strict';

import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function GenderSelect({ control, errors }) {
  return (
    <FormControl fullWidth error={!!errors.gender} sx={{ mt: 2 }}>
      <InputLabel id="gender-label">Gender</InputLabel>
      <Controller
        name="gender"
        control={control}
        rules={{ required: 'Gender is required' }}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value || ''}
            labelId="gender-label"
            id="gender-select"
            label="Gender"
          >
            <MenuItem value="" disabled>
              Select gender
            </MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        )}
      />
      {errors.gender && (
        <FormHelperText>{errors.gender.message || 'Gender is required'}</FormHelperText>
      )}
    </FormControl>
  );
}

