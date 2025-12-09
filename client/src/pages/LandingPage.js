'use strict';

import React, { useMemo } from 'react';
import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  StyledEngineProvider,
} from '@mui/material';
import Navigation from '../components/landing/header/Navigation';
import HeroSection from '../components/landing/hero/HeroSection';
import FeaturesSection from '../components/landing/features/FeaturesSection';
import ProfessionalsSection from '../components/landing/about/ProfessionalsSection';
import GetStartedSteps from '../components/landing/steps/GetStartedSteps';
import PrinciplesSection from '../components/landing/principles/PrinciplesSection';
import PricingSection from '../components/landing/pricing/PricingSection';
import TestimonialsSection from '../components/landing/testimonials/TestimonialsSection';
import FAQSection from '../components/landing/faq/FAQSection';
import CTABanner from '../components/landing/cta/CTABanner';
import Footer from '../components/landing/footer/Footer';
import AnimationWrapper from '../components/landing/Animation';

const LandingPage = () => {
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
    // <AnimationWrapper>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', backgroundColor: 'white' }}>
          <Navigation />
          <HeroSection />
          <FeaturesSection />
          <ProfessionalsSection />
          <GetStartedSteps />
          <PrinciplesSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <CTABanner />
          <Footer />
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
    // </AnimationWrapper>
  );
};

export default LandingPage;

