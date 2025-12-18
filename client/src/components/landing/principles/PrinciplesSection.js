'use strict';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { AttachMoney as AttachMoneyIcon, Home as HomeIcon } from '@mui/icons-material';
import prototypeIllustration from '../../../images/landing/prototype-illustration.svg';

const PrinciplesSection = () => {
  const theme = useTheme();

  const handleLearnMore = () => {
    window.location.href = '#features';
  };

  const principles = [
    {
      icon: AttachMoneyIcon,
      title: 'Free online live Chat',
      description:
        "Stop using third-party apps to conduct online chat. Use our most powerful and easy-to-use platform to conduct your online chat with users. It's 100% free.",
      iconColor: '#10b981',
      iconBgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      icon: HomeIcon,
      title: 'Separate Portals Available',
      description:
        'our school management system comes with a separate portal for every user role. An admin portal with full controls, separate portals for Management admin, Teachers, and Students.',
      iconColor: '#ef4444',
      iconBgColor: 'rgba(239, 68, 68, 0.1)',
    },
  ];

  return (
    <Box
      component="section"
      id="principles"
      sx={{
        width: '100%',
        backgroundColor: 'white',
        py: { xs: 8, md: 12 },
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
          right: 0,
          width: { xs: '200px', md: '300px' },
          height: { xs: '200px', md: '300px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(100, 21, 255, 0.1)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: { xs: '150px', md: '250px' },
          height: { xs: '150px', md: '250px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(100, 21, 255, 0.1)',
          filter: 'blur(60px)',
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
                VALUES
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
                We Always Abide by{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Our Principles.
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
                SchoolHub is a completely free online school management software,
                it has more school management features than any other online
                school management system in the market. It does not end here,
                SchoolHub is still enhancing features. You will be automatically
                updated as a new feature will be a part of our free school
                management software. Some main school management features are
                given below.
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {principles.map((principle, index) => {
                  const IconComponent = principle.icon;
                  return (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card
                        sx={{
                          height: '100%',
                          boxShadow: 'none',
                          border: 'none',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: '50%',
                              backgroundColor: principle.iconBgColor,
                              border: `1px solid ${principle.iconColor}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2,
                            }}
                          >
                            <IconComponent
                              sx={{
                                fontSize: 28,
                                color: principle.iconColor,
                              }}
                            />
                          </Box>

                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              fontSize: { xs: '1rem', md: '1.125rem' },
                              fontWeight: 'bold',
                              color: 'text.primary',
                              mb: 1.5,
                            }}
                          >
                            {principle.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: '0.875rem', md: '0.9375rem' },
                              color: 'text.secondary',
                              lineHeight: 1.7,
                            }}
                          >
                            {principle.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: '300px', md: '500px' },
              }}
            >
              <Box
                component="img"
                src={prototypeIllustration}
                alt="Woman with whiteboard and tablet showing workflow diagrams"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 2,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PrinciplesSection;

