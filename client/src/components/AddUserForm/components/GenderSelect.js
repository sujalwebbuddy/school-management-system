'use strict';

import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function GenderSelect({ control, errors }) {
  return (
    <FormControl fullWidth error={!!errors.gender}>
      <Controller
        name="gender"
        control={control}
        rules={{ required: 'Gender is required' }}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value || ''}
            displayEmpty
            id="gender-select"
            sx={{ borderRadius: 1.5 }}
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

