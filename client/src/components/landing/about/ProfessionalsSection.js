'use strict';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import dotPattern from '../../../images/landing/dot-pattern.svg';
import ClassroomImage from '../../../images/landing/classroom.jpg';

const ProfessionalsSection = () => {
  const theme = useTheme();

  const handleLearnMore = () => {
    window.location.href = '#features';
  };

  return (
    <Box
      component="section"
      id="about"
      sx={{
        width: '100%',
        backgroundColor: 'white',
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: '150px', md: '200px' },
          height: { xs: '150px', md: '200px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 182, 193, 0.2)',
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
          backgroundImage: `url(${dotPattern})`,
          backgroundSize: 'contain',
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  mb: 1,
                }}
              >
                QUALITY WORK
              </Typography>

              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                  fontWeight: 'bold',
                  color: 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                Designed & Developed{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  by Professionals.
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  maxWidth: '36rem',
                }}
              >
                SchoolHub is a complete and feature-rich school management
                software for all educational institutes. It covers learning,
                administration, and management activities in schools, colleges,
                universities, tuition centers, or training centers. Start with our
                free plan for attendance tracking, then upgrade to access exams,
                homework management, analytics, and advanced communication tools.
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLearnMore}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 500,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                '&::before': {
                  content: '""',
                  display: 'block',
                  paddingTop: '75%',
                },
              }}
            >
              <Box
                component="img"
                src={ClassroomImage}
                alt="Modern classroom with desks and educational equipment"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfessionalsSection;

