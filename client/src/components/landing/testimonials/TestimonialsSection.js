'use strict';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Rating,
  useTheme,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import loveIllustration from '../../../images/landing/love-illustration.svg';

const TestimonialsSection = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      rating: 5,
      title: 'Amazing User Experience',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      customerName: 'Charlotte Hale',
      customerTitle: 'Director, Delos Inc.',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    {
      rating: 5,
      title: 'Love the Developer Experience',
      text: 'Sinor Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      customerName: 'Adam Cuppy',
      customerTitle: 'Founder, EventsNYC',
      avatarUrl:
        'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop',
    },
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Box
      component="section"
      id="testimonials"
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
          width: { xs: '150px', md: '200px' },
          height: { xs: '150px', md: '200px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(100, 21, 255, 0.1)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
            TESTIMONIALS
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
            Our Clients{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Love Us.
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
            eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad
            minim veniam.
          </Typography>
        </Box>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={5}>
            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                position: 'relative',
                height: '100%',
                minHeight: '400px',
              }}
            >
              <Box
                component="img"
                src={loveIllustration}
                alt="Abstract illustration with heart and people"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: 2,
                p: { xs: 3, md: 4 },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ mb: 3 }}>
                  <Rating
                    value={currentTestimonial.rating}
                    readOnly
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#fbbf24',
                      },
                    }}
                  />
                </Box>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 2,
                  }}
                >
                  {currentTestimonial.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    mb: 4,
                  }}
                >
                  {currentTestimonial.text}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={currentTestimonial.avatarUrl}
                      alt={currentTestimonial.customerName}
                      sx={{
                        width: { xs: 56, md: 64 },
                        height: { xs: 56, md: 64 },
                      }}
                    />
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 'bold',
                          color: 'text.primary',
                          fontSize: { xs: '0.875rem', md: '1rem' },
                        }}
                      >
                        {currentTestimonial.customerName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: { xs: '0.75rem', md: '0.875rem' },
                        }}
                      >
                        {currentTestimonial.customerTitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={handlePrevious}
                      sx={{
                        backgroundColor: 'rgba(100, 21, 255, 0.1)',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(100, 21, 255, 0.2)',
                        },
                      }}
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      onClick={handleNext}
                      sx={{
                        backgroundColor: 'rgba(100, 21, 255, 0.1)',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'rgba(100, 21, 255, 0.2)',
                        },
                      }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;

