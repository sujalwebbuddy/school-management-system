'use strict';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { getUserData } from '../../../../slices/userSlice';
import { LoadingButton } from '@mui/lab';
import Page from '../components/Page';
import api from '../../../../utils/api';

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const genderOptions = [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
  ];

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo || !userInfo._id) {
      dispatch(getUserData());
    }
  }, [dispatch, userInfo]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('profile-image', file);
      }
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phoneNumber);
      if (data.age) {
        formData.append('age', data.age);
      }
      if (data.gender) {
        formData.append('gender', data.gender);
      }

      setLoading(true);
      await api.put(`/admin/user/update/${userInfo._id}`, formData);

      await swal('Done!', 'Profile has been updated successfully!', 'success');
      dispatch(getUserData());
      setLoading(false);
    } catch (error) {
      const message =
        error?.response?.data?.msg ||
        'Failed to update profile. Please try again.';
      await swal('Oops!', message, 'error');
      setLoading(false);
    }
  };

  return (
    <Page title="Profile">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
      </Stack>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Avatar
                      src={userInfo?.profileImage}
                      sx={{
                        height: 100,
                        mb: 2,
                        width: 100,
                      }}
                    />
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {`${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim().toUpperCase() || 'Admin User'}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {userInfo?.role || 'admin'}
                    </Typography>
                    {userInfo?.organization && (
                      <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                        {userInfo.organization.name}
                      </Typography>
                    )}
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{ color: 'green', mt: 1 }}
                    >
                      Approved
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <label htmlFor="upload-photo" style={{ width: '100%' }}>
                    <input
                      style={{ display: 'none' }}
                      id="upload-photo"
                      name="upload-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                      color="primary"
                      variant="outlined"
                      component="span"
                      fullWidth
                    >
                      Upload Photo
                    </Button>
                  </label>
                </CardActions>
              </Card>
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Card>
                  <CardHeader
                    subheader="Update your personal information"
                    title="Profile Information"
                  />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          defaultValue={userInfo?.firstName || ''}
                          variant="outlined"
                          {...register('firstName')}
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          defaultValue={userInfo?.lastName || ''}
                          variant="outlined"
                          {...register('lastName')}
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          defaultValue={userInfo?.email || ''}
                          variant="outlined"
                          {...register('email', {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phoneNumber"
                          type="tel"
                          defaultValue={userInfo?.phoneNumber || ''}
                          variant="outlined"
                          {...register('phoneNumber')}
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber?.message}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Age"
                          name="age"
                          type="number"
                          defaultValue={userInfo?.age || ''}
                          variant="outlined"
                          inputProps={{ min: 1, max: 120 }}
                          {...register('age')}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Gender"
                          name="gender"
                          select
                          defaultValue={userInfo?.gender || ''}
                          SelectProps={{ native: true }}
                          variant="outlined"
                          {...register('gender')}
                        >
                          <option value="">Select Gender</option>
                          {genderOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: 2,
                    }}
                  >
                    <LoadingButton
                      type="submit"
                      loading={loading}
                      variant="contained"
                      color="primary"
                    >
                      Save Changes
                    </LoadingButton>
                  </Box>
                </Card>
              </form>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};

export default Profile;
