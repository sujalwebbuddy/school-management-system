'use strict';

import {
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  InputAdornment,
  Box,
} from '@mui/material';
import { BookOutlined } from '@mui/icons-material';
import { Controller } from 'react-hook-form';

const commonInputSx = {
  borderRadius: 1.5,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(145, 158, 171, 0.32)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'text.primary',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
    borderWidth: 2,
  },
};

const labelSx = {
  mb: 1,
  fontWeight: 600,
  color: 'text.primary',
  fontSize: '0.875rem',
};

export default function SubjectFormFields({ register, control, errors, classes }) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={labelSx}>
          School Class
        </Typography>
        <FormControl fullWidth error={!!errors.classname}>
          <Controller
            name="classname"
            control={control}
            rules={{ required: 'Class name is required' }}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                id="class-select"
                sx={{ borderRadius: 1.5 }}
              >
                <MenuItem value="" disabled>
                  Select a class
                </MenuItem>
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
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={labelSx}>
          Subject Name
        </Typography>
        <TextField
          placeholder="e.g. Mathematics"
          variant="outlined"
          fullWidth
          {...register('subjectName', { required: 'Subject name is required' })}
          error={!!errors.subjectName}
          helperText={errors.subjectName?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BookOutlined sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            sx: commonInputSx,
          }}
        />
      </Box>
    </Stack>
  );
}

