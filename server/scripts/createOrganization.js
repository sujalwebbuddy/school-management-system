'use strict';

const readline = require('readline');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const config = require('../config/envConfig');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const postData = JSON.stringify(data);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = httpModule.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function createOrganization() {
  try {
    console.log('\n=== Create New Organization ===\n');

    const name = await question('Enter Organization Name: ');
    if (!name.trim()) {
      console.error('Error: Organization Name is required');
      rl.close();
      process.exit(1);
    }

    const domain = await question('Enter Organization Domain (e.g., springfield-high): ');
    if (!domain.trim()) {
      console.error('Error: Organization Domain is required');
      rl.close();
      process.exit(1);
    }

    // Validate domain format
    const domainRegex = /^[a-z0-9-]+$/;
    if (!domainRegex.test(domain.trim())) {
      console.error('Error: Domain can only contain lowercase letters, numbers, and hyphens');
      rl.close();
      process.exit(1);
    }

    console.log('\nSubscription Tiers:');
    console.log('1. primary    - $0/month, Max 100 users');
    console.log('2. high_school - $37.99/month, Max 500 users');
    console.log('3. university  - $57.99/month, Max 2000 users');

    const tierChoice = await question('\nSelect subscription tier (1-3): ');
    let subscriptionTier;

    switch (tierChoice.trim()) {
      case '1':
        subscriptionTier = 'primary';
        break;
      case '2':
        subscriptionTier = 'high_school';
        break;
      case '3':
        subscriptionTier = 'university';
        break;
      default:
        console.error('Error: Invalid tier selection');
        rl.close();
        process.exit(1);
    }

    console.log('\nSubscription Status:');
    console.log('1. active   - Organization is active and can be used');
    console.log('2. inactive - Organization is disabled');
    console.log('3. trial    - Organization is in trial period');

    const statusChoice = await question('\nSelect subscription status (1-3) [default: active]: ');
    let subscriptionStatus = 'active';

    switch (statusChoice.trim()) {
      case '1':
      case '':
        subscriptionStatus = 'active';
        break;
      case '2':
        subscriptionStatus = 'inactive';
        break;
      case '3':
        subscriptionStatus = 'trial';
        break;
      default:
        console.error('Error: Invalid status selection');
        rl.close();
        process.exit(1);
    }

    const maxUsersInput = await question('\nEnter max users (press Enter for default): ');
    let maxUsers;
    if (maxUsersInput.trim()) {
      maxUsers = parseInt(maxUsersInput.trim());
      if (isNaN(maxUsers) || maxUsers <= 0) {
        console.error('Error: Max users must be a positive number');
        rl.close();
        process.exit(1);
      }
    }

    const timezone = await question('\nEnter timezone (press Enter for UTC): ') || 'UTC';
    const currency = await question('Enter currency (press Enter for USD): ') || 'USD';
    const language = await question('Enter language (press Enter for en): ') || 'en';

    rl.close();

    const serverUrl = config.SERVER_BASE_URL || `http://localhost:${config.PORT}`;
    const apiUrl = `${serverUrl}/api/v1/organizations/createOrganization`;

    console.log('\nCreating organization...\n');

    const requestData = {
      name: name.trim(),
      domain: domain.trim(),
      subscriptionTier,
      subscriptionStatus,
      ...(maxUsers && { maxUsers }),
      settings: {
        timezone: timezone.trim(),
        currency: currency.trim(),
        language: language.trim()
      }
    };

    const response = await makeRequest(apiUrl, requestData);

    if (response.status === 201) {
      console.log('✅ Success:', response.data.msg || 'Organization created successfully');
      console.log('\nOrganization Details:');
      console.log('- Name:', response.data.organization.name);
      console.log('- Domain:', response.data.organization.domain);
      console.log('- Tier:', response.data.organization.subscriptionTier);
      console.log('- Status:', response.data.organization.subscriptionStatus);
      console.log('- Max Users:', response.data.organization.maxUsers);
      console.log('- Features:', response.data.organization.features.join(', '));
      console.log('- Organization ID:', response.data.organization.id);
      process.exit(0);
    } else {
      console.error('❌ Error:', response.data.msg || response.data || 'Failed to create organization');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Make sure the server is running on', config.SERVER_BASE_URL || `http://localhost:${config.PORT}`);
    }
    rl.close();
    process.exit(1);
  }
}

createOrganization();