'use strict';

import { Grid, Typography, InputAdornment, Box, TextField } from '@mui/material';
import { PersonOutline, EmailOutlined, LockOutlined, PhoneOutlined } from '@mui/icons-material';
import GenderSelect from './GenderSelect';
import ClassSelect from './ClassSelect';
import SubjectSelect from './SubjectSelect';

export default function UserFormFields({
  register,
  errors,
  control,
  userRole,
  classrooms,
  subjects,
}) {
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" sx={labelSx}>
          First Name
        </Typography>
        <TextField
          placeholder="Enter first name"
          variant="outlined"
          fullWidth
          {...register('firstName', { required: 'First name is required' })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutline sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            sx: commonInputSx,
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" sx={labelSx}>
          Last Name
        </Typography>
        <TextField
          placeholder="Enter last name"
          variant="outlined"
          fullWidth
          {...register('lastName', { required: 'Last name is required' })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutline sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            sx: commonInputSx,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={labelSx}>
          Email Address
        </Typography>
        <TextField
          placeholder="Enter email address"
          type="email"
          variant="outlined"
          fullWidth
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlined sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            sx: commonInputSx,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={labelSx}>
          Password
        </Typography>
        <TextField
          placeholder="Enter password"
          type="password"
          variant="outlined"
          fullWidth
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            sx: commonInputSx,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={labelSx}>
          Phone Number
        </Typography>
        <TextField
          placeholder="Enter phone number"
          type="tel"
          variant="outlined"
          fullWidth
          {...register('phoneNumber', {
            required: 'Phone number is required',
            pattern: {
              value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[\s./0-9]*$/,
              message: 'Invalid phone number',
            },
          })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneOutlined sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            sx: commonInputSx,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={labelSx}>
          Gender
        </Typography>
        <GenderSelect control={control} errors={errors} />
      </Grid>

      {userRole === 'student' && (
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={labelSx}>
            Class
          </Typography>
          <ClassSelect control={control} errors={errors} classrooms={classrooms} />
        </Grid>
      )}

      {userRole === 'teacher' && (
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={labelSx}>
            Subject
          </Typography>
          <SubjectSelect control={control} errors={errors} subjects={subjects} />
        </Grid>
      )}
    </Grid>
  );
}

