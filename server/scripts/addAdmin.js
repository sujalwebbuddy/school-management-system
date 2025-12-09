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

async function addAdmin() {
  try {
    console.log('\n=== Create New Admin Account ===\n');
    
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
    };

    const response = await makeRequest(apiUrl, requestData);
    
    if (response.status === 200) {
      console.log('Success:', response.data.msg || 'Admin created successfully');
      process.exit(0);
    } else {
      console.error('Error:', response.data.msg || response.data || 'Failed to create admin');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Make sure the server is running on', config.SERVER_BASE_URL || `http://localhost:${config.PORT}`);
    }
    rl.close();
    process.exit(1);
  }
}

addAdmin();

