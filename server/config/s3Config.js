'use strict';

const { S3Client } = require('@aws-sdk/client-s3');
const config = require('./envConfig');

class S3ConfigError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'S3ConfigError';
    this.code = 'S3_CONFIG_ERROR';
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

const s3ClientConfig = {
  region: config.S3_REGION,
};

if (config.S3_ACCESS_KEY_ID && config.S3_SECRET_ACCESS_KEY) {
  s3ClientConfig.credentials = {
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  };
}

if (!config.S3_REGION) {
  throw new S3ConfigError('S3_REGION is required in environment variables', {
    missingVariable: 'S3_REGION',
  });
}

if (!config.S3_BUCKET_NAME) {
  throw new S3ConfigError('S3_BUCKET_NAME is required in environment variables', {
    missingVariable: 'S3_BUCKET_NAME',
  });
}

const s3Client = new S3Client(s3ClientConfig);

module.exports = {
  s3Client,
  s3BucketName: config.S3_BUCKET_NAME,
  s3Region: config.S3_REGION,
  S3ConfigError,
};

