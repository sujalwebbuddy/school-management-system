'use strict';

import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function SubjectSelect({ control, errors, subjects }) {
  return (
    <FormControl fullWidth error={!!errors.subject}>
      <Controller
        name="subject"
        control={control}
        rules={{ required: 'Subject is required' }}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value || ''}
            displayEmpty
            id="subject-select"
            sx={{ borderRadius: 1.5 }}
          >
            <MenuItem value="" disabled>
              Select teacher's subject
            </MenuItem>
            {subjects && subjects.length > 0 ? (
              subjects.map((sub, index) => (
                <MenuItem key={index} value={sub}>
                  {sub}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No subjects available
              </MenuItem>
            )}
          </Select>
        )}
      />
      {errors.subject && (
        <FormHelperText>{errors.subject.message || 'Subject is required'}</FormHelperText>
      )}
    </FormControl>
  );
}

