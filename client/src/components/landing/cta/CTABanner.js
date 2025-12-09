'use strict';

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CTABanner = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleContactUs = () => {
    window.location.href = '#contact';
  };

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        backgroundColor: '#6415ff',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Purple Blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: { xs: '100px', md: '150px' },
          height: { xs: '100px', md: '150px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: { xs: '100px', md: '150px' },
          height: { xs: '100px', md: '150px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.75rem', lg: '2rem' },
              fontWeight: 'bold',
              color: 'white',
              flex: 1,
            }}
          >
            Institution all over the world are happily using SchoolHub.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              flexShrink: 0,
            }}
          >
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                backgroundColor: '#f97316',
                color: 'white',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', md: '1rem' },
                '&:hover': {
                  backgroundColor: '#ea580c',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              onClick={handleContactUs}
              sx={{
                borderColor: 'white',
                borderWidth: 2,
                color: '#6415ff',
                backgroundColor: 'white',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: { xs: '0.875rem', md: '1rem' },
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CTABanner;

