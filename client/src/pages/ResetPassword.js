import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import ResetPasswordForm from '../components/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <ResetPasswordForm />
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
