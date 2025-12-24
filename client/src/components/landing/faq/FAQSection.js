'use strict';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const FAQSection = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: 'Is SchoolHub Platform free ?',
      answer:
        'Yes, we offer a free plan for primary schools with up to 100 users and essential features like attendance tracking. For advanced features like chat, exams, homework, and analytics, you can upgrade to our High School ($37.99/month) or University ($57.99/month) plans.',
    },
    {
      question: 'What are the differences between the plans?',
      answer:
        'Primary School (Free): Up to 100 users with attendance tracking. High School ($37.99/month): Up to 500 users with chat, exams, homework management, and analytics. University ($57.99/month): Up to 2,000 users with all features including advanced reports and premium support.',
    },
    {
      question: 'What kind of payment methods do you accept ?',
      answer:
        'We accept all kinds of payment methods including credit cards, debit cards, and bank transfers. For enterprise plans, we also support invoice-based billing.',
    },
    {
      question:
        'Is there a subscription service to get the latest information ?',
      answer:
        'Yes, we usually recommend users to subscribe to our newsletter to stay always up-to-date with the latest features, updates, and educational resources.',
    },
  ];

  return (
    <Box
      component="section"
      id="faq"
      sx={{
        width: '100%',
        backgroundColor: 'white',
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            You have{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Questions ?
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
            Find answers to commonly asked questions about SchoolHub Platform.
            If you have additional questions, feel free to contact our support
            team.
          </Typography>
        </Box>

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                mb: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 1,
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '0 0 16px 0',
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ color: 'primary.main' }} />
                }
                sx={{
                  px: { xs: 2, md: 3 },
                  py: { xs: 1.5, md: 2 },
                  '& .MuiAccordionSummary-content': {
                    my: 1.5,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontSize: { xs: '0.9375rem', md: '1.125rem' },
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: { xs: 2, md: 3 },
                  pb: { xs: 2, md: 3 },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    color: 'text.secondary',
                    lineHeight: 1.7,
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQSection;

