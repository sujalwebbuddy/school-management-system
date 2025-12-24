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

function makeRequest(url, data, method = 'POST') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;
    
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + (urlObj.search || ''),
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

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

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function getOrganizations() {
  try {
    const serverUrl = config.SERVER_BASE_URL || `http://localhost:${config.PORT}`;
    const apiUrl = `${serverUrl}/api/v1/organizations/listOrganizations?limit=100`;
    
    const response = await makeRequest(apiUrl, null, 'GET');
    
    if (response.status === 200 && response.data.success) {
      return response.data.organizations || [];
    }
    return [];
  } catch (error) {
    console.error('Warning: Could not fetch organizations list:', error.message);
    return [];
  }
}

async function getOrganizationByDomain(domain) {
  try {
    const serverUrl = config.SERVER_BASE_URL || `http://localhost:${config.PORT}`;
    const apiUrl = `${serverUrl}/api/v1/organizations/listOrganizations?limit=100`;
    
    const response = await makeRequest(apiUrl, null, 'GET');
    
    if (response.status === 200 && response.data.success) {
      const orgs = response.data.organizations || [];
      const org = orgs.find(o => o.domain.toLowerCase() === domain.toLowerCase());
      return org;
    }
    return null;
  } catch (error) {
    console.error('Error fetching organization:', error.message);
    return null;
  }
}

async function addAdmin() {
  try {
    console.log('\n=== Create New Admin Account ===\n');
    
    // Fetch organizations list
    console.log('Fetching organizations...\n');
    const organizations = await getOrganizations();
    
    let organizationId;
    let organizationDomain;
    
    if (organizations.length > 0) {
      console.log('Available Organizations:');
      organizations.forEach((org, index) => {
        console.log(`${index + 1}. ${org.name} (@${org.domain}) - ${org.subscriptionTier} - ${org.subscriptionStatus}`);
      });
      
      const orgChoice = await question('\nSelect organization number (or enter domain manually): ');
      const orgIndex = parseInt(orgChoice.trim(), 10) - 1;
      
      if (orgIndex >= 0 && orgIndex < organizations.length) {
        const selectedOrg = organizations[orgIndex];
        organizationId = selectedOrg._id || selectedOrg.id;
        organizationDomain = selectedOrg.domain;
        console.log(`\nSelected: ${selectedOrg.name} (@${selectedOrg.domain})\n`);
      } else {
        // User entered domain manually
        organizationDomain = orgChoice.trim();
        if (!organizationDomain) {
          console.error('Error: Organization domain is required');
          rl.close();
          process.exit(1);
        }
        
        const org = await getOrganizationByDomain(organizationDomain);
        if (!org) {
          console.error(`Error: Organization with domain "${organizationDomain}" not found`);
          rl.close();
          process.exit(1);
        }
        organizationId = org._id || org.id;
        console.log(`\nFound: ${org.name} (@${org.domain})\n`);
      }
    } else {
      // No organizations found, ask for domain
      organizationDomain = await question('Enter Organization Domain (e.g., springfield-high): ');
      if (!organizationDomain.trim()) {
        console.error('Error: Organization domain is required');
        rl.close();
        process.exit(1);
      }
      
      const org = await getOrganizationByDomain(organizationDomain.trim());
      if (!org) {
        console.error(`Error: Organization with domain "${organizationDomain}" not found`);
        console.error('   Please create an organization first using: npm run create-org');
        rl.close();
        process.exit(1);
      }
      organizationId = org._id || org.id;
      console.log(`\nFound: ${org.name} (@${org.domain})\n`);
    }
    
    const firstName = await question('Enter First Name: ');
    if (!firstName.trim()) {
      console.error('Error: First Name is required');
      rl.close();
      process.exit(1);
    }

    const lastName = await question('Enter Last Name: ');
    if (!lastName.trim()) {
      console.error('Error: Last Name is required');
      rl.close();
      process.exit(1);
    }

    const email = await question('Enter Email: ');
    if (!email.trim()) {
      console.error('Error: Email is required');
      rl.close();
      process.exit(1);
    }

    const password = await question('Enter Password: ');
    if (!password.trim()) {
      console.error('Error: Password is required');
      rl.close();
      process.exit(1);
    }

    rl.close();

    const serverUrl = config.SERVER_BASE_URL || `http://localhost:${config.PORT}`;
    const apiUrl = `${serverUrl}/api/v1/admin/newAdmin`;
    
    console.log('\nCreating admin account...\n');
    
    const requestData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password.trim(),
      organizationId: organizationId,
    };

    const response = await makeRequest(apiUrl, requestData);
    
    if (response.status === 200) {
      console.log('✅ Success:', response.data.msg || 'Admin created successfully');
      if (response.data.organization) {
        console.log(`   Organization: ${response.data.organization}`);
      }
      process.exit(0);
    } else {
      console.error('❌ Error:', response.data.msg || response.data || 'Failed to create admin');
      if (response.data.code) {
        console.error(`   Error Code: ${response.data.code}`);
      }
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

addAdmin();

