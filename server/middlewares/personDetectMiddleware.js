'use strict';

const tf = require('@tensorflow/tfjs-node');
const coco_ssd = require('@tensorflow-models/coco-ssd');

class PersonDetectionError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'PersonDetectionError';
    this.code = 'PERSON_DETECTION_ERROR';
    this.statusCode = context.statusCode || 500;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

async function loadModel() {
  try {
    const model = await coco_ssd.load({
      base: 'mobilenet_v1',
    });
    return model;
  } catch (error) {
    throw new PersonDetectionError('Failed to load detection model', {
      statusCode: 500,
      originalError: error,
    });
  }
}

async function detectPersonInImage(imageBuffer) {
  try {
    const tensor = tf.node.decodeImage(imageBuffer, 3);
    const model = await loadModel();
    const predictions = await model.detect(tensor, 3, 0.25);
    tensor.dispose();
    return predictions;
  } catch (error) {
    if (error instanceof PersonDetectionError) {
      throw error;
    }
    throw new PersonDetectionError('Failed to detect person in image', {
      statusCode: 500,
      originalError: error,
    });
  }
}

exports.makePredictions = async (req, res, next) => {
  if (req?.file?.buffer) {
    try {
      const predictions = await detectPersonInImage(req.file.buffer);
      if (predictions[0]?.class === 'person') {
        return next();
      } else {
        return res.status(404).json({ msg: 'Please upload a person\'s image' });
      }
    } catch (error) {
      if (error instanceof PersonDetectionError) {
        return res.status(error.statusCode).json({
          msg: error.message,
          code: error.code,
        });
      }
      return res.status(500).json({ msg: 'Expected image (BMP, JPEG, PNG or GIF)!' });
    }
  } else {
    return next();
  }
};
