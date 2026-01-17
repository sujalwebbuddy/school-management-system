'use strict';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import facebookIcon from '../../../images/landing/facebook-icon.svg';
import twitterIcon from '../../../images/landing/twitter-icon.svg';
import youtubeIcon from '../../../images/landing/youtube-icon.svg';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  };

  const footerLinks = {
    main: [
      { text: 'FAQs', href: '/faq' },
      { text: 'Contact', href: '/contact' },
      { text: 'About Us', href: '#about' },
    ],
    product: [
      { text: 'Log In', href: '/login' },
      { text: 'Sign Up', href: '/register' },
      { text: 'Pricing', href: '#pricing' },
      { text: 'Features', href: '#features' },
    ],
    legal: [
      { text: 'Privacy Policy', href: '/privacy-policy' },
      { text: 'Terms of Service', href: '/terms-of-service' },
      { text: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { icon: facebookIcon, alt: 'Facebook', href: 'https://facebook.com' },
    { icon: twitterIcon, alt: 'Twitter', href: 'https://twitter.com' },
    { icon: youtubeIcon, alt: 'YouTube', href: 'https://youtube.com' },
  ];

  return (
    <Box
      component="footer"
      id="contact"
      sx={{
        width: '100%',
        backgroundColor: '#1e1b4b',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section - Navigation Links */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={4} md={2.4}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                mb: 2,
                display: 'block',
              }}
            >
              MAIN
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.main.map((link, index) =>
                link.href.startsWith('#') ? (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                ) : (
                  <Link
                    key={index}
                    component={RouterLink}
                    to={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                )
              )}
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2.4}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                mb: 2,
                display: 'block',
              }}
            >
              PRODUCT
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.product.map((link, index) =>
                link.href.startsWith('#') ? (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                ) : (
                  <Link
                    key={index}
                    component={RouterLink}
                    to={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                )
              )}
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2.4}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                mb: 2,
                display: 'block',
              }}
            >
              LEGAL
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            mb: 4,
          }}
        />

        {/* Bottom Section - Logo, Copyright, Social */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: '#6415ff',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
              }}
            >
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                }}
              >
                Sh
              </Typography>
            </Box>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              SchoolHub Inc.
            </Typography>
          </Box>

          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              textAlign: { xs: 'left', md: 'center' },
            }}
          >
            © 2025 SchoolHub Inc. All Rights Reserved.
          </Typography>

          {/* Social Media Icons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {socialLinks.map((social, index) => (
              <Box
                key={index}
                component="a"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 0.7,
                  },
                }}
              >
                <Box
                  component="img"
                  src={social.icon}
                  alt={social.alt}
                  sx={{
                    width: 24,
                    height: 24,
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

