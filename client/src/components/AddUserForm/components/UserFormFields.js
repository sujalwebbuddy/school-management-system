'use strict';

import { TextField, Stack } from '@mui/material';
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
  return (
    <Stack spacing={3}>
      <TextField
        label="First Name"
        variant="outlined"
        fullWidth
        {...register('firstName', { required: 'First name is required' })}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />

      <TextField
        label="Last Name"
        variant="outlined"
        fullWidth
        {...register('lastName', { required: 'Last name is required' })}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />

      <TextField
        label="Email"
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
      />

      <TextField
        label="Password"
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
      />

      <TextField
        label="Phone Number"
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
      />

      <GenderSelect control={control} errors={errors} />

      {userRole === 'student' && (
        <ClassSelect control={control} errors={errors} classrooms={classrooms} />
      )}

      {userRole === 'teacher' && (
        <SubjectSelect control={control} errors={errors} subjects={subjects} />
      )}
    </Stack>
  );
}

