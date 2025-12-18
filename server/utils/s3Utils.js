'use strict';

const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, s3BucketName } = require('../config/s3Config');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class S3UploadError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'S3UploadError';
    this.code = 'S3_UPLOAD_ERROR';
    this.statusCode = context.statusCode || 500;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

class S3DeleteError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'S3DeleteError';
    this.code = 'S3_DELETE_ERROR';
    this.statusCode = context.statusCode || 500;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

function generateFileName(originalName, folder = 'schoolhub') {
  const fileExtension = path.extname(originalName);
  const baseName = path.basename(originalName, fileExtension);
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '-');
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  return `${folder}/${timestamp}-${sanitizedName}-${uniqueId}${fileExtension}`;
}

async function uploadToS3(fileBuffer, originalName, folder = 'uploads', contentType = null) {
  try {
    if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
      throw new S3UploadError('Invalid file buffer provided', {
        statusCode: 400,
        providedType: typeof fileBuffer,
      });
    }

    if (!originalName || typeof originalName !== 'string') {
      throw new S3UploadError('Original filename is required', {
        statusCode: 400,
      });
    }

    const fileName = generateFileName(originalName, folder);
    const detectedContentType = contentType || getContentTypeFromFileName(originalName);

    const uploadParams = {
      Bucket: s3BucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: detectedContentType,
      ACL: 'public-read',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${s3BucketName}.s3.amazonaws.com/${fileName}`;

    return {
      url: fileUrl,
      key: fileName,
      bucket: s3BucketName,
    };
  } catch (error) {
    if (error instanceof S3UploadError) {
      throw error;
    }
    throw new S3UploadError('Failed to upload file to S3', {
      statusCode: 500,
      originalError: error,
      originalName,
    });
  }
}

async function deleteFromS3(fileKey) {
  try {
    if (!fileKey || typeof fileKey !== 'string') {
      throw new S3DeleteError('File key is required for deletion', {
        statusCode: 400,
      });
    }

    const deleteParams = {
      Bucket: s3BucketName,
      Key: fileKey,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    return { success: true, deletedKey: fileKey };
  } catch (error) {
    if (error instanceof S3DeleteError) {
      throw error;
    }
    throw new S3DeleteError('Failed to delete file from S3', {
      statusCode: 500,
      originalError: error,
      fileKey,
    });
  }
}

function extractKeyFromUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(part => part);
    if (pathParts.length > 0) {
      return pathParts.slice(1).join('/');
    }
    return null;
  } catch (error) {
    if (url.includes(s3BucketName)) {
      const match = url.match(new RegExp(`${s3BucketName}/(.+)`));
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }
}

function getContentTypeFromFileName(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

module.exports = {
  uploadToS3,
  deleteFromS3,
  extractKeyFromUrl,
  generateFileName,
  S3UploadError,
  S3DeleteError,
};

