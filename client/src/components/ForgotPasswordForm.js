import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
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
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Business,
  Email,
  ArrowBack,
  Send,
  School,
  Person,
} from "@mui/icons-material";
import "./auth.css";

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [step, setStep] = useState('email'); // 'email' | 'organization' | 'submitted'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const onSubmitEmail = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // First, find organizations for this email
      const findOrgResult = await api.post("/organizations/find-users", { email: data.email });

      if (!findOrgResult.found) {
        // No organizations found, but still try to send reset email for security
        await api.post("/users/forgot-password", { email: data.email });

        setStep('submitted');
        return;
      }

      if (findOrgResult.organizations.length === 1) {
        // Only one organization, proceed directly
        await api.post("/users/forgot-password", {
          email: data.email,
          organizationDomain: findOrgResult.organizations[0].domain
        });

        setStep('submitted');
      } else {
        // Multiple organizations, let user choose
        setOrganizations(findOrgResult.organizations);
        setStep('organization');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSelectOrganization = async (org) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedOrg(org);

      await api.post("/users/forgot-password", {
        email: document.querySelector('input[name="email"]')?.value,
        organizationDomain: org.domain
      });

      setStep('submitted');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSelectedOrg(null);
    }
  };

  if (step === 'submitted') {
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
              <Send sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Check Your Email
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              We've sent password reset instructions to your email address.
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            onClick={onBackToLogin}
            startIcon={<ArrowBack />}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Back to Login
          </Button>
        </Stack>
      </form>
    );
  }

  if (step === 'organization') {
    return (
      <form className="sign-in-form">
        <Stack spacing={3} sx={{ width: '100%', maxWidth: 380, px: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Select Your Organization
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              We found your account in multiple organizations. Please select the one where you want to reset your password.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 1.5 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            {organizations.map((org) => (
              <Card
                key={org.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '2px solid transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 2,
                  },
                }}
                onClick={() => onSelectOrganization(org)}
              >
                <CardContent sx={{ py: 2, px: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'primary.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <School sx={{ color: 'primary.main' }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {org.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {org.domain}
                      </Typography>
                      {org.roles && org.roles.length > 0 && (
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {org.roles.map((role) => (
                            <Chip
                              key={role}
                              label={role}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>
                    {selectedOrg?.id === org.id && (
                      <CircularProgress size={24} />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Button
            fullWidth
            variant="text"
            onClick={() => setStep('email')}
            startIcon={<ArrowBack />}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Back
          </Button>
        </Stack>
      </form>
    );
  }

  return (
    <form className="sign-in-form">
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 380, px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Forgot Password?
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
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
          onClick={handleSubmit(onSubmitEmail)}
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
          startIcon={!loading && <Send />}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={onBackToLogin}
          startIcon={<ArrowBack />}
          sx={{
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          Back to Login
        </Button>
      </Stack>
    </form>
  );
};

export default ForgotPasswordForm;
