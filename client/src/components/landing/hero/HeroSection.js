'use strict';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import designIllustration from '../../../images/landing/design-illustration-2.svg';
import customersLogoStrip from '../../../images/landing/customers-logo-strip.png';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      navigate('/register', { state: { email } });
    }
  };

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        backgroundColor: 'white',
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  fontWeight: 'bold',
                  color: 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                Online School Management System{' '}
                <Box
                  component="span"
                  sx={{
                    color: 'primary.main',
                  }}
                >
                  for you.
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  maxWidth: '36rem',
                }}
              >
                Now you can manage your school, college, or any educational
                center with SchoolHub Platform. It's 100% free for a lifetime
                with no limitations.
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  mt: 2,
                }}
              >
                <TextField
                  type="email"
                  placeholder="Your E-mail Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 500,
                    borderRadius: 1,
                    whiteSpace: 'nowrap',
                    minWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Get Started
                </Button>
              </Box>

              <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #e5e7eb' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    mb: 2,
                    display: 'block',
                  }}
                >
                  OUR TRUSTED CUSTOMERS
                </Typography>
                <Box
                  component="img"
                  src={customersLogoStrip}
                  alt="Trusted customers: FORTUNE, The Weather Channel, FAST COMPANY, NATIONAL GEOGRAPHIC"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    opacity: 0.7,
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: { xs: 'none', lg: 'block' },
                textAlign: 'center',
              }}
            >
              <Box
                component="img"
                src={designIllustration}
                alt="Person working at desk with computer"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '32rem',
                  mx: 'auto',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;

