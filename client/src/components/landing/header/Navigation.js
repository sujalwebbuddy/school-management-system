'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import logoImage from '../../../images/landing/logo.svg';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 50,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '80px',
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logoImage}
              alt="SchoolHub"
              style={{ height: '40px', width: 'auto' }}
            />
            <Typography
              variant="h5"
              component="span"
              sx={{
                ml: 1.5,
                fontWeight: 'bold',
                color: 'text.primary',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              SchoolHub
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Button
              component={Link}
              to="#about"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' },
                textTransform: 'none',
              }}
            >
              About
            </Button>
            <Button
              component={Link}
              to="#features"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' },
                textTransform: 'none',
              }}
            >
              Features
            </Button>
            <Button
              component={Link}
              to="#pricing"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' },
                textTransform: 'none',
              }}
            >
              Pricing
            </Button>
            <Button
              component={Link}
              to="#contact"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' },
                textTransform: 'none',
              }}
            >
              Contact Us
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { color: 'primary.main' },
                textTransform: 'none',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="primary"
              sx={{
                px: 3,
                py: 1,
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;

