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
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navigation from '../components/landing/header/Navigation';
import Footer from '../components/landing/footer/Footer';

const PrivacyPolicy = () => {
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
                }}
              >
                Privacy Policy
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                }}
              >
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    1. Introduction
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    SchoolHub Inc. ("we," "our," or "us") is committed to
                    protecting your privacy. This Privacy Policy explains how
                    we collect, use, disclose, and safeguard your information
                    when you use our SchoolHub Platform.
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    2. Information We Collect
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    We collect information that you provide directly to us,
                    including:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Personal information (name, email address, phone number)
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Account credentials and profile information
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Educational information (class assignments, grades,
                        attendance records)
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Communication data (messages, emails, chat logs)
                      </Typography>
                    </li>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    3. How We Use Your Information
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    We use the information we collect to:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Provide, maintain, and improve our services
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Process transactions and send related information
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Send administrative information and updates
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Respond to your comments and questions
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Monitor and analyze usage patterns
                      </Typography>
                    </li>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    4. Information Sharing and Disclosure
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    We do not sell, trade, or rent your personal information to
                    third parties. We may share your information only in the
                    following circumstances:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        With your consent
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        To comply with legal obligations
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        To protect our rights and safety
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        With service providers who assist in our operations
                      </Typography>
                    </li>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    5. Data Security
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    We implement appropriate technical and organizational
                    security measures to protect your personal information
                    against unauthorized access, alteration, disclosure, or
                    destruction. However, no method of transmission over the
                    Internet is 100% secure.
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    6. Your Rights
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    You have the right to:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Access and receive a copy of your personal data
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Request correction of inaccurate data
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Request deletion of your personal data
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Object to processing of your personal data
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Request restriction of processing
                      </Typography>
                    </li>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    7. Children's Privacy
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    Our platform is designed for educational institutions. We
                    comply with applicable laws regarding children's privacy,
                    including the Children's Online Privacy Protection Act
                    (COPPA). Student information is collected and used only for
                    educational purposes with appropriate consent.
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    8. Changes to This Privacy Policy
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the "Last updated" date.
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontSize: { xs: '1.5rem', md: '2rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2,
                    }}
                  >
                    9. Contact Us
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    If you have any questions about this Privacy Policy, please
                    contact us at:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                    }}
                  >
                    Email: privacy@schoolhub.com
                    <br />
                    Address: SchoolHub Inc., Privacy Department
                  </Typography>
                </Box>
              </Box>
            </Container>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default PrivacyPolicy;

