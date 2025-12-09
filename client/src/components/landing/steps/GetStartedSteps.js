'use strict';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import conferenceImage from '../../../images/landing/conference.png';
import dotPattern from '../../../images/landing/dot-pattern.svg';

const GetStartedSteps = () => {
  const theme = useTheme();

  const steps = [
    {
      number: '01',
      title: 'Register',
      description: 'Register your information in the register form.',
    },
    {
      number: '02',
      title: 'Wait',
      description:
        'Your information will be checked by the admin and you will get approved as soon as possible.',
    },
    {
      number: '03',
      title: 'Use',
      description:
        'Now you can use SchoolHub Platform easily whenever you want.',
    },
  ];

  return (
    <Box
      component="section"
      id="steps"
      sx={{
        width: '100%',
        backgroundColor: 'white',
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6} order={{ xs: 2, lg: 1 }}>
            <Box
              sx={{
                position: 'relative',
                backgroundColor: '#14b8a6',
                borderRadius: 2,
                overflow: 'hidden',
                minHeight: { xs: '300px', md: '400px', lg: '500px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 3, md: 4 },
              }}
            >
              <Box
                component="img"
                src={conferenceImage}
                alt="Video conference interface on laptop"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  zIndex: 2,
                  position: 'relative',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: { xs: '80px', md: '120px' },
                  height: { xs: '80px', md: '120px' },
                  backgroundImage: `url(${dotPattern})`,
                  backgroundSize: 'contain',
                  opacity: 0.3,
                  zIndex: 1,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} lg={6} order={{ xs: 1, lg: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'primary.main',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 2,
                    display: 'block',
                  }}
                >
                  STEPS
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
                  Easy to{' '}
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    Get Started.
                  </Box>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {steps.map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: 3,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 'bold',
                        color: '#9ca3af',
                        lineHeight: 1,
                        minWidth: { xs: '60px', md: '80px' },
                      }}
                    >
                      {step.number}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontSize: { xs: '1.125rem', md: '1.25rem' },
                          fontWeight: 'bold',
                          color: 'text.primary',
                          mb: 1,
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          color: 'text.secondary',
                          lineHeight: 1.7,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default GetStartedSteps;

