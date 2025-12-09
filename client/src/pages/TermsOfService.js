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
} from '@mui/material';
import Navigation from '../components/landing/header/Navigation';
import Footer from '../components/landing/footer/Footer';

const TermsOfService = () => {
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
                Terms of Service
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
                    1. Acceptance of Terms
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    By accessing and using the SchoolHub Platform ("Service"),
                    you accept and agree to be bound by the terms and provision
                    of this agreement. If you do not agree to these Terms of
                    Service, please do not use our Service.
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
                    2. Use License
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    Permission is granted to temporarily use SchoolHub Platform
                    for personal, non-commercial educational purposes only. This
                    is the grant of a license, not a transfer of title, and under
                    this license you may not:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Modify or copy the materials
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Use the materials for any commercial purpose
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Attempt to reverse engineer any software contained in the
                        Service
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        Remove any copyright or other proprietary notations
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
                    3. User Accounts
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    When you create an account with us, you must provide
                    information that is accurate, complete, and current at all
                    times. You are responsible for safeguarding the password and
                    for all activities that occur under your account.
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
                    4. Acceptable Use
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    You agree not to use the Service:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        In any way that violates any applicable law or regulation
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        To transmit any malicious code or harmful content
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        To impersonate or attempt to impersonate another user
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        To interfere with or disrupt the Service or servers
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', lineHeight: 1.7 }}
                      >
                        To collect or store personal data about other users
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
                    5. Content Ownership
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    You retain ownership of any content you submit, post, or
                    display on or through the Service. By submitting content,
                    you grant us a worldwide, non-exclusive, royalty-free license
                    to use, reproduce, modify, and distribute such content for
                    the purpose of operating and providing the Service.
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
                    6. Service Availability
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    We strive to maintain the availability of our Service but
                    do not guarantee uninterrupted access. We reserve the right
                    to modify, suspend, or discontinue the Service (or any part
                    thereof) at any time with or without notice.
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
                    7. Limitation of Liability
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    In no event shall SchoolHub Inc., its directors, employees,
                    or agents be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including without
                    limitation, loss of profits, data, use, goodwill, or other
                    intangible losses, resulting from your use of the Service.
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
                    8. Indemnification
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    You agree to defend, indemnify, and hold harmless SchoolHub
                    Inc. and its officers, directors, employees, and agents from
                    and against any claims, liabilities, damages, losses, and
                    expenses arising out of or in any way connected with your
                    access to or use of the Service.
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
                    9. Termination
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    We may terminate or suspend your account and access to the
                    Service immediately, without prior notice or liability, for
                    any reason whatsoever, including without limitation if you
                    breach the Terms. Upon termination, your right to use the
                    Service will immediately cease.
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
                    10. Changes to Terms
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. If a revision is material,
                    we will provide at least 30 days notice prior to any new
                    terms taking effect.
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
                    11. Governing Law
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    These Terms shall be governed and construed in accordance
                    with the laws of the jurisdiction in which SchoolHub Inc. is
                    incorporated, without regard to its conflict of law
                    provisions.
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
                    12. Contact Information
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    If you have any questions about these Terms of Service,
                    please contact us at:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                    }}
                  >
                    Email: legal@schoolhub.com
                    <br />
                    Address: SchoolHub Inc., Legal Department
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

export default TermsOfService;

