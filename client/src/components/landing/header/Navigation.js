'use strict';

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import { logoutUser } from '../../../slices/userSlice';
import logoImage from '../../../images/landing/logo.svg';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuth, userInfo } = useSelector((state) => state.user);

  const handleDashboardClick = () => {
    if (!isAuth) return;

    switch (userInfo.role) {
      case 'admin':
        navigate('/dashboard');
        break;
      case 'student':
        navigate('/studentDashboard');
        break;
      case 'teacher':
        navigate('/teacherDashboard');
        break;
      default:
        navigate('/login');
        break;
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleSectionScroll = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.querySelector(sectionId);
      if (element) {
        const headerOffset = 80; // Height of sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(sectionId);
        if (element) {
          const headerOffset = 80; // Height of sticky header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
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
              onClick={() => handleSectionScroll('#about')}
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
              onClick={() => handleSectionScroll('#features')}
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
              onClick={() => handleSectionScroll('#pricing')}
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
              onClick={() => navigate('/contact')}
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
            {isAuth ? (
              <>
                <Button
                  onClick={handleDashboardClick}
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
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    '&:hover': { color: 'primary.main' },
                    textTransform: 'none',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;

