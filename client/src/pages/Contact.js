'use strict';

import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Support,
  Business,
} from '@mui/icons-material';
import Navigation from '../components/landing/header/Navigation';
import Footer from '../components/landing/footer/Footer';

const Contact = () => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#6415ff',
            light: '#7c3fff',
            dark: '#5a0fe6',
            contrastText: '#ffffff',
          },
          text: {
            primary: '#1f2937',
            secondary: '#6b7280',
          },
          background: {
            default: '#ffffff',
            paper: '#ffffff',
          },
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
      }),
    []
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', backgroundColor: 'white' }}>
          <Navigation />
          <Box
            sx={{
              py: { xs: 6, md: 10 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <Container maxWidth="md">
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 'bold',
                  color: 'text.primary',
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                Contact Us
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 6,
                  textAlign: 'center',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.7,
                }}
              >
                We're here to help! Whether you have questions about our platform, need technical support, or want to learn more about our services, our team is ready to assist you. Reach out to us through any of the channels below, and we'll get back to you as soon as possible.
              </Typography>

              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 3,
                    textAlign: 'center',
                  }}
                >
                  Get in Touch
                </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      boxShadow: 2,
                    }}
                  >
                    <CardContent>
                      <Email
                        sx={{
                          fontSize: 48,
                          color: 'primary.main',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Email
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        support@schoolhub.com
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      boxShadow: 2,
                    }}
                  >
                    <CardContent>
                      <Phone
                        sx={{
                          fontSize: 48,
                          color: 'primary.main',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Phone
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +1 (555) 123-4567
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      boxShadow: 2,
                    }}
                  >
                    <CardContent>
                      <LocationOn
                        sx={{
                          fontSize: 48,
                          color: 'primary.main',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        123 Education Street
                        <br />
                        City, State 12345
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Additional Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      boxShadow: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime
                        sx={{
                          fontSize: 32,
                          color: 'primary.main',
                          mr: 2,
                        }}
                      />
                      <Typography variant="h6" fontWeight={600}>
                        Business Hours
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Saturday:</strong> 10:00 AM - 4:00 PM EST
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Sunday:</strong> Closed
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                      We typically respond to emails within 24 hours during business days.
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      boxShadow: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Support
                        sx={{
                          fontSize: 32,
                          color: 'primary.main',
                          mr: 2,
                        }}
                      />
                      <Typography variant="h6" fontWeight={600}>
                        Support Types
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      <strong>Technical Support:</strong> For technical issues, bugs, or platform questions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      <strong>Sales Inquiries:</strong> Questions about pricing, plans, or features
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      <strong>Account Management:</strong> Billing, subscription, or account-related questions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>General Inquiries:</strong> Any other questions or feedback
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Card
                sx={{
                  p: 4,
                  boxShadow: 2,
                  borderRadius: 2,
                  backgroundColor: 'primary.lighter',
                  background: 'linear-gradient(135deg, rgba(100, 21, 255, 0.05) 0%, rgba(124, 63, 255, 0.05) 100%)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Business
                    sx={{
                      fontSize: 40,
                      color: 'primary.main',
                      mr: 2,
                    }}
                  />
                  <Typography variant="h5" fontWeight={600} color="text.primary">
                    Partnership Opportunities
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    textAlign: 'center',
                    maxWidth: '700px',
                    mx: 'auto',
                    lineHeight: 1.7,
                    mb: 2,
                  }}
                >
                  Interested in partnering with SchoolHub? We're always looking to collaborate with educational institutions, technology partners, and service providers. Reach out to us at{' '}
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    partnerships@schoolhub.com
                  </Box>{' '}
                  to discuss how we can work together to improve education management.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  We value your feedback and are committed to providing the best possible service. Your input helps us improve and grow.
                </Typography>
              </Card>
            </Box>
            </Container>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Contact;

