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

const SubjectSelect = ({ 
  control = null, 
  errors = {}, 
  name = 'subject', 
  label = 'Subject', 
  style = {},
  role = 'teacher' // 'teacher' or 'admin'
}) => {
  const subjectRaw = useSelector((state) => {
    if (role === 'admin') {
      return state?.admin?.userInfo?.user?.subject;
    }
    return state?.teacher?.userInfo?.user?.subject;
  });

  const getSubjects = () => {
    if (!subjectRaw) {
      return [];
    }
    if (Array.isArray(subjectRaw)) {
      return subjectRaw.map((sub) =>
        typeof sub === 'object' ? sub?.name || sub?._id : sub
      );
    }
    if (typeof subjectRaw === 'object') {
      return [subjectRaw?.name || subjectRaw?._id];
    }
    return [subjectRaw];
  };

  const subjects = getSubjects();

  return (
    <FormControl
      fullWidth
      style={{ marginTop: '16px', ...style }}
      error={!!errors[name]}
    >
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Controller
        name={name}
        control={control || null}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            {...field}
            value={field.value || ''}
            labelId={`${name}-label`}
            id={`${name}-select`}
            label={label}
          >
            {subjects && subjects.length > 0 ? (
              subjects.map((sub, index) => (
                <MenuItem key={index} value={sub}>
                  {sub}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No subject available
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

export default SubjectSelect;

