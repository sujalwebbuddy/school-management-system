'use strict';

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

const ClassNameSelect = ({ 
  control, 
  errors, 
  name = 'classname', 
  label = 'Class Name', 
  style = {},
  role = 'teacher' // 'teacher' or 'admin'
}) => {
  const classList = useSelector((state) => {
    if (role === 'admin') {
      return state.admin?.classrooms?.classes || [];
    }
    return state.teacher?.classrooms?.classes || [];
  });

  return (
    <FormControl
      fullWidth
      style={{ marginTop: '16px', ...style }}
      error={!!errors[name]}
    >
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value || ''}
            labelId={`${name}-label`}
            id={`${name}-select`}
            label={label}
          >
            {classList && classList.length > 0 ? (
              classList.map((classItem) => {
                const className =
                  classItem.className || classItem.classesName || '';
                const classId = classItem._id || '';
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
      {errors[name] && (
        <FormHelperText>{label} is required</FormHelperText>
      )}
    </FormControl>
  );
};

export default ClassNameSelect;

