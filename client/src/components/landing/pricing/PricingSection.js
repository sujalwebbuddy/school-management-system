'use strict';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const PricingSection = () => {
  const plans = [
    {
      name: 'PRIMARY SCHOOL',
      price: '$0,00',
      billing: 'MONTHLY',
      features: [
        { text: 'For Schools', bold: true },
        { text: '1 Admin' },
        { text: '2 Roles' },
        { text: 'Chat App' },
        { text: 'Basic Assistance' },
      ],
      buttonColor: '#14b8a6',
      buttonTextColor: '#ffffff',
      borderColor: '#14b8a6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      featured: false,
    },
    {
      name: 'HIGH SCHOOL',
      price: '$37.99',
      billing: 'MONTHLY',
      features: [
        { text: 'For High School', bold: true },
        { text: '2 Admins' },
        { text: '3 User roles' },
        { text: 'Chat App and online meetings' },
        { text: 'Priority Assistance' },
      ],
      buttonColor: '#ffffff',
      buttonTextColor: '#6415ff',
      borderColor: '#6415ff',
      backgroundColor: '#6415ff',
      textColor: '#ffffff',
      featured: true,
    },
    {
      name: 'UNIVERSITY',
      price: '$57.99',
      billing: 'MONTHLY',
      features: [
        { text: 'For Universities', bold: true },
        { text: 'Multiple admins' },
        { text: '6 User roles' },
        { text: 'All features' },
        { text: 'Personal Assistance' },
      ],
      buttonColor: '#ef4444',
      buttonTextColor: '#ffffff',
      borderColor: '#ef4444',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      featured: false,
    },
  ];

  const handleBuyNow = (planName) => {
    window.location.href = '/register';
  };

  return (
    <Box
      component="section"
      id="pricing"
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
            PRICING
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
            Reasonable & Flexible{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              Plans.
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

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: plan.backgroundColor,
                  borderTop: `4px solid ${plan.borderColor}`,
                  borderRadius: 2,
                  boxShadow: plan.featured
                    ? '0 10px 40px rgba(100, 21, 255, 0.2)'
                    : '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: plan.featured
                      ? '0 15px 50px rgba(100, 21, 255, 0.3)'
                      : '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 3, md: 4 },
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      fontWeight: 'bold',
                      color: plan.textColor,
                      textTransform: 'uppercase',
                      mb: 2,
                    }}
                  >
                    {plan.name}
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 'bold',
                        color: plan.textColor,
                        lineHeight: 1,
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.75rem',
                        color: plan.featured ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                      }}
                    >
                      {plan.billing}
                    </Typography>
                  </Box>

                  <List
                    sx={{
                      flexGrow: 1,
                      mt: 2,
                      mb: 3,
                      '& .MuiListItem-root': {
                        px: 0,
                        py: 0.5,
                      },
                    }}
                  >
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex}>
                        <ListItemText
                          primary={feature.text}
                          primaryTypographyProps={{
                            fontSize: { xs: '0.875rem', md: '1rem' },
                            fontWeight: feature.bold ? 'bold' : 'normal',
                            color: plan.textColor,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleBuyNow(plan.name)}
                    sx={{
                      backgroundColor: plan.buttonColor,
                      color: plan.buttonTextColor,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      borderRadius: 1,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      '&:hover': {
                        backgroundColor: plan.buttonColor,
                        opacity: 0.9,
                      },
                    }}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PricingSection;

