'use strict';

const { uploadToS3, S3UploadError } = require('../utils/s3Utils');

class S3UploadMiddlewareError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'S3UploadMiddlewareError';
    this.code = 'S3_UPLOAD_MIDDLEWARE_ERROR';
    this.statusCode = context.statusCode || 500;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

function uploadFileToS3(folder = 'uploads') {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        return next();
      }

      if (!req.file.buffer) {
        return next(new S3UploadMiddlewareError('File buffer is missing', {
          statusCode: 400,
        }));
      }

      const uploadResult = await uploadToS3(
        req.file.buffer,
        req.file.originalname,
        folder
      );

      req.file.s3Url = uploadResult.url;
      req.file.s3Key = uploadResult.key;

      next();
    } catch (error) {
      if (error instanceof S3UploadError || error instanceof S3UploadMiddlewareError) {
        return next(error);
      }
      return next(new S3UploadMiddlewareError('Failed to upload file to S3', {
        statusCode: 500,
        originalError: error,
      }));
    }
  };
}

module.exports = {
  uploadFileToS3,
  S3UploadMiddlewareError,
};

