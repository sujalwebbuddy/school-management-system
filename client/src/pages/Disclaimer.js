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

const Disclaimer = () => {
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
                Disclaimer
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
                    General Information
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    The information contained on the SchoolHub Platform is for general information purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the platform or the information, products, services, or related graphics contained on the platform for any purpose.
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
                    Limitation of Liability
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    In no event will SchoolHub Inc. be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this platform.
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
                    External Links
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    Through this platform, you are able to link to other websites which are not under the control of SchoolHub Inc. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
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
                    Contact Information
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                    }}
                  >
                    If you have any questions about this Disclaimer, please contact us at:
                    <br />
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

export default Disclaimer;

