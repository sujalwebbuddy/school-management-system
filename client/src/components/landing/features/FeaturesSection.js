'use strict';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import shieldIcon from '../../../images/landing/shield-icon.svg';
import supportIcon from '../../../images/landing/support-icon.svg';
import customizeIcon from '../../../images/landing/customize-icon.svg';
import reliableIcon from '../../../images/landing/reliable-icon.svg';
import fastIcon from '../../../images/landing/fast-icon.svg';
import percentageIcon from '../../../images/landing/percentage-icon.svg';

const FeaturesSection = () => {
  const theme = useTheme();

  const features = [
    {
      icon: shieldIcon,
      title: 'Fast, Secure & Easy',
      description:
        'We use advanced tools and technologies to build up this free school software. It is super fast, secure, reliable, and easy to use and manage.',
    },
    {
      icon: supportIcon,
      title: 'Regular Updates & Support',
      description:
        'We add new and awesome features regularly to make our school administrative software unmatchable. Free online 24/7 support for users.',
    },
    {
      icon: customizeIcon,
      title: 'Infographics & Animations',
      description:
        "We use infographics and animations to explain student's reports and results. Our free school software facilitates you with the optimized result.",
    },
    {
      icon: reliableIcon,
      title: 'Responsive Web Design',
      description:
        'You can use our free school management software on any device, like Mobile, Tablet, Laptop, or desktop due to its responsive design.',
    },
    {
      icon: fastIcon,
      title: 'Cloud Based Software',
      description:
        'SchoolHub is free school software that is always online, you can access it from anywhere, anytime. We will take care of your data and backups.',
    },
    {
      icon: percentageIcon,
      title: 'Absolutely Free',
      description:
        'SchoolHub is an absolutely 100% free school management software for a lifetime with no limitations. No need to buy anything. Just Sign Up',
    },
  ];

  return (
    <Box
      component="section"
      id="features"
      sx={{
        width: '100%',
        backgroundColor: 'white',
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            FEATURES
          </Typography>

          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 2,
            }}
          >
            SchoolHub has{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Amazing Features.
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: 'text.secondary',
              maxWidth: '42rem',
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(100, 21, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <Box
                      component="img"
                      src={feature.icon}
                      alt={feature.title}
                      sx={{
                        width: 32,
                        height: 32,
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                      fontSize: { xs: '1.125rem', md: '1.25rem' },
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      fontSize: { xs: '0.875rem', md: '1rem' },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;

