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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navigation from '../components/landing/header/Navigation';
import Footer from '../components/landing/footer/Footer';

const FAQ = () => {
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

  const faqs = [
    {
      question: 'What is SchoolHub?',
      answer: 'SchoolHub is an educational platform designed to help schools manage students, teachers, classes, and educational activities efficiently.',
    },
    {
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking on the "Register" button and following the registration process. Organizations need to sign up first, then users can be added.',
    },
    {
      question: 'What features are available?',
      answer: 'SchoolHub offers features including student management, class organization, exam management, homework assignments, attendance tracking, and communication tools.',
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact our support team via email at support@schoolhub.com or by phone at +1 (555) 123-4567. We typically respond within 24 hours.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a free plan for organizations to get started. You can upgrade to a paid plan at any time to access additional features.',
    },
  ];

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
                Frequently Asked Questions
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 6,
                  textAlign: 'center',
                }}
              >
                Find answers to common questions about SchoolHub.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {faqs.map((faq, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Container>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default FAQ;

