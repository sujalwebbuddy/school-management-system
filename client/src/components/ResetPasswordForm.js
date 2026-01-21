import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  LockReset,
} from "@mui/icons-material";
import api from "../utils/api";
import "./auth.css";

const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [verifyingToken, setVerifyingToken] = useState(true);

  const navigate = useNavigate();
  const { token } = useParams();

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await api.post("/verify-reset-token", { token });

        if (result.data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError(result.data.msg || "Invalid or expired reset token");
        }
      } catch (err) {
        setTokenValid(false);
        setError(err.message || "Failed to verify reset token");
      } finally {
        setVerifyingToken(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setError("No reset token provided");
      setVerifyingToken(false);
    }
  }, [token]);

  const onSubmitResetPassword = async (data) => {
    try {
      setLoading(true);
      setError(null);

      await api.post("/reset-password", {
        token,
        newPassword: data.password,
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  if (verifyingToken) {
    return (
      <form className="sign-in-form">
        <Stack spacing={3} sx={{ width: '100%', maxWidth: 380, px: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Verifying reset token...
            </Typography>
          </Box>
        </Stack>
      </form>
    );
  }

  if (tokenValid === false) {
    return (
      <form className="sign-in-form">
        <Stack spacing={3} sx={{ width: '100%', maxWidth: 380, px: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'error.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Lock sx={{ fontSize: 40, color: 'error.main' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Invalid Reset Link
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              This password reset link is invalid or has expired.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5, mb: 3 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/')}
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
              }}
            >
              Go to Login
            </Button>
          </Box>
        </Stack>
      </form>
    );
  }

  if (success) {
    return (
      <form className="sign-in-form">
        <Stack spacing={3} sx={{ width: '100%', maxWidth: 380, px: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'success.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Password Reset Successful
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Your password has been successfully reset. You can now log in with your new password.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/')}
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
              }}
            >
              Continue to Login
            </Button>
          </Box>
        </Stack>
      </form>
    );
  }

  return (
    <form className="sign-in-form">
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 380, px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'primary.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <LockReset sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Reset Your Password
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter your new password below.
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            New Password
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter your new password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
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
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                backgroundColor: '#f8fafc',
                '& fieldset': {
                  borderColor: 'rgba(145, 158, 171, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'text.primary',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            Confirm New Password
          </Typography>
          <TextField
            fullWidth
            placeholder="Confirm your new password"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => {
                if (watch('password') !== value) {
                  return "Passwords do not match";
                }
              }
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                backgroundColor: '#f8fafc',
                '& fieldset': {
                  borderColor: 'rgba(145, 158, 171, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'text.primary',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          size="large"
          type="submit"
          disabled={loading}
          onClick={handleSubmit(onSubmitResetPassword)}
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
          startIcon={!loading && <LockReset />}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
        </Button>
      </Stack>
    </form>
  );
};

export default ResetPasswordForm;
