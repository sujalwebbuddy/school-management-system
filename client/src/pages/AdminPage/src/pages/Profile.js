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
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Cake,
  Wc,
  CloudUpload,
  CheckCircle,
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { getUserData } from '../../../../slices/userSlice';
import { LoadingButton } from '@mui/lab';
import Page from '../components/Page';
import api from '../../../../utils/api';
import ChangePasswordDialog from '../../../../components/ChangePasswordDialog';

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
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

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
    <>
    <Page title="Profile">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography variant="h4" fontWeight={600} color="text.primary">
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
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        mb: 3,
                      }}
                    >
                      <Avatar
                        src={preview || userInfo?.profileImage}
                        sx={{
                          height: 120,
                          width: 120,
                          border: '4px solid',
                          borderColor: 'primary.main',
                          boxShadow: 4,
                        }}
                      />
                      <IconButton
                        component="label"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                          border: '3px solid white',
                        }}
                        size="small"
                      >
                        <CloudUpload fontSize="small" />
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </IconButton>
                    </Box>
                    <Typography
                      color="textPrimary"
                      gutterBottom
                      variant="h5"
                      fontWeight={600}
                      textAlign="center"
                    >
                      {`${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim().toUpperCase() || 'Admin User'}
                    </Typography>
                    <Chip
                      label={userInfo?.role || 'admin'}
                      size="small"
                      sx={{
                        mt: 1,
                        mb: 1,
                        textTransform: 'capitalize',
                        bgcolor: 'primary.lighter',
                        color: 'primary.dark',
                        fontWeight: 500,
                      }}
                    />
                    {userInfo?.organization && (
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        sx={{ mt: 1, mb: 1 }}
                      >
                        {userInfo.organization.name}
                      </Typography>
                    )}
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 16 }} />}
                      label="Approved"
                      color="success"
                      size="small"
                      sx={{
                        mt: 1,
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ p: 2, flexDirection: 'column', gap: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudUpload />}
                    sx={{
                      textTransform: 'none',
                      py: 1.5,
                    }}
                  >
                    {file ? 'Change Photo' : 'Upload Photo'}
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setChangePasswordOpen(true)}
                    sx={{
                      textTransform: 'none',
                      py: 1.5,
                      background: 'linear-gradient(to right, #2563EB, #4F46E5)',
                      '&:hover': {
                        background: 'linear-gradient(to right, #1D4ED8, #4338CA)',
                      },
                    }}
                  >
                    Change Password
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardHeader
                    title={
                      <Typography variant="h5" fontWeight={600}>
                        Profile Information
                      </Typography>
                    }
                    subheader={
                      <Typography variant="body2" color="text.secondary">
                        Update your personal information. All fields marked with * are required.
                      </Typography>
                    }
                    sx={{ pb: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          defaultValue={userInfo?.firstName || ''}
                          variant="outlined"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="action" />
                              </InputAdornment>
                            ),
                          }}
                          {...register('firstName')}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          defaultValue={userInfo?.lastName || ''}
                          variant="outlined"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="action" />
                              </InputAdornment>
                            ),
                          }}
                          {...register('lastName')}
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
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="action" />
                              </InputAdornment>
                            ),
                          }}
                          {...register('email', {
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
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
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone color="action" />
                              </InputAdornment>
                            ),
                          }}
                          {...register('phoneNumber')}
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
                          error={!!errors.age}
                          helperText={errors.age?.message}
                          inputProps={{ min: 1, max: 120 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Cake color="action" />
                              </InputAdornment>
                            ),
                          }}
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
                          error={!!errors.gender}
                          helperText={errors.gender?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Wc color="action" />
                              </InputAdornment>
                            ),
                          }}
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
                      gap: 2,
                      p: 3,
                    }}
                  >
                    <LoadingButton
                      type="submit"
                      loading={loading}
                      variant="contained"
                      color="primary"
                      sx={{
                        textTransform: 'none',
                        px: 4,
                      }}
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

    <ChangePasswordDialog
      open={changePasswordOpen}
      onClose={() => setChangePasswordOpen(false)}
    />
    </>
  );
};

export default Profile;
