import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { loginUser } from "../slices/userSlice";
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Business,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import "./auth.css";

const commonInputSx = {
  borderRadius: 1.5,
  backgroundColor: '#f8fafc', // Slight off-white background for contrast on white card
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(145, 158, 171, 0.2)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'text.primary',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
    borderWidth: 2,
  },
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { errors: loginerror, isAuth, userInfo, loading } = useSelector((state) => state.user);
  const nav = useNavigate();

  useEffect(() => {
    if (isAuth && userInfo.role === "admin") nav("/dashboard");
    else if (isAuth && userInfo.role === "student") nav("/studentDashboard");
    else if (isAuth && userInfo.role === "teacher") nav("/teacherDashboard");
  }, [isAuth, nav, userInfo.role]);

  const onSubmitLogin = (data) => {
    dispatch(loginUser(data));
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form className="sign-in-form">
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 380, px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sign in to continue to your account
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            Organization Domain
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your organization domain"
            variant="outlined"
            {...register("organizationDomain", { required: "Organization Domain is required" })}
            error={!!errors.organizationDomain}
            helperText={errors.organizationDomain?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              sx: commonInputSx,
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your email"
            type="email"
            variant="outlined"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              sx: commonInputSx,
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            Password
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: commonInputSx,
            }}
          />
        </Box>

        {loginerror && (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>
            {loginerror}
          </Alert>
        )}

        <Button
          fullWidth
          size="large"
          type="submit"
          disabled={loading}
          onClick={handleSubmit(onSubmitLogin)}
          sx={{
            py: 1.5,
            fontWeight: 700,
            borderRadius: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.24)',
            background: 'linear-gradient(to right, #2563EB, #4F46E5)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(to right, #1D4ED8, #4338CA)',
              boxShadow: '0 12px 24px -6px rgba(37, 99, 235, 0.4)',
            },
            '&.Mui-disabled': {
              background: 'rgba(145, 158, 171, 0.24)',
              color: 'rgba(145, 158, 171, 0.8)',
            }
          }}
          startIcon={!loading && <LoginIcon />}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;



