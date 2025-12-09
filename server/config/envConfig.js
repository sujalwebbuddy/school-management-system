// Environment Configuration
// Centralized environment variable management

require('dotenv').config();

const config = {
  // Server Configuration
  PORT: process.env.PORT || 4000,
  
  // Database Configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/school-management',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'jwt_secret_is_not_what_you_think_it_just_that_we_are',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001'],
  
  // Server Base URL
  SERVER_BASE_URL: process.env.SERVER_BASE_URL || 'http://localhost:4000',
  
  // Email Configuration
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  
  // Default Assets
  DEFAULT_PROFILE_IMAGE_URL: process.env.DEFAULT_PROFILE_IMAGE_URL || 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Validation for required environment variables
const requiredEnvVars = ['JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];

const missingEnvVars = requiredEnvVars.filter(envVar => !config[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Log configuration (only in development)
if (config.NODE_ENV === 'development') {
  console.log('🔧 Environment Configuration Loaded:');
  console.log(`   - PORT: ${config.PORT}`);
  console.log(`   - Database: ${config.MONGO_URI ? 'Configured' : 'Not configured'}`);
  console.log(`   - JWT: ${config.JWT_SECRET ? 'Configured' : 'Not configured'}`);
  console.log(`   - CORS Origin: ${config.CORS_ORIGIN}`);
  console.log(`   - Email Service: ${config.EMAIL_USER ? 'Configured' : 'Not configured'}`);
  console.log('');
}

module.exports = config;
