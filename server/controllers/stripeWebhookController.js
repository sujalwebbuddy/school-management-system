'use strict';

const Organization = require('../models/organizationModel');
const User = require('../models/userModel');
const stripe = require('stripe')(require('../config/envConfig').STRIPE_SECRET_KEY);
const config = require('../config/envConfig');

class WebhookError extends Error {
  constructor(message, code = 'WEBHOOK_ERROR', statusCode = 400) {
    super(message);
    this.name = 'WebhookError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Handle Stripe webhook events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ msg: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ msg: 'Webhook handler failed' });
  }
};

const handlePaymentSuccess = async (paymentIntent) => {
  const metadata = paymentIntent.metadata;
  
  if (metadata.organization_domain) {
    const organization = await Organization.findOne({
      domain: metadata.organization_domain
    });

    if (organization) {
      organization.subscriptionStatus = 'active';
      await organization.save();
      console.log(`Organization ${organization.name} activated via webhook`);
    }
  }
};

const handlePaymentFailure = async (paymentIntent) => {
  const metadata = paymentIntent.metadata;
  
  if (metadata.organization_domain) {
    const organization = await Organization.findOne({
      domain: metadata.organization_domain
    });

    if (organization && organization.subscriptionStatus === 'trial') {
      organization.subscriptionStatus = 'inactive';
      await organization.save();
      console.log(`Organization ${organization.name} deactivated due to payment failure`);
    }
  }
};

const handleRefund = async (charge) => {
  const paymentIntentId = charge.payment_intent;
  
  if (paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const metadata = paymentIntent.metadata;
    
    if (metadata.organization_domain) {
      const organization = await Organization.findOne({
        domain: metadata.organization_domain
      });

      if (organization) {
        organization.subscriptionStatus = 'inactive';
        await organization.save();
        console.log(`Organization ${organization.name} deactivated due to refund`);
      }
    }
  }
};

module.exports = {
  handleStripeWebhook
};
