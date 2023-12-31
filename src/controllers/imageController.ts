import { Request, Response } from 'express';
import path from 'path';
import {
  validationResult,
  check,
  ValidationError,
  Result,
  ValidationChain,
} from 'express-validator';
import fs from 'fs/promises';
import logger from '../utils/logger';
import { resizeImage, ImageFormat } from '../services/imageProcessing';
import { getFromCache, addToCache } from '../services/ImageCache';

// Configuration settings
const imageConfig = {
  originalPath: '../assets/original',
  thumbnailPath: '../assets/thumbnail',
  defaultFormat: 'jpg',
  defaultQuality: 80,
};

// Validation rules for image parameters
const validateImageParameters = (): ValidationChain[] => [
  check('width').optional().isInt().toInt(),
  check('height').optional().isInt().toInt(),
  check('imageName').notEmpty(),
  check('format').optional().isIn(['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG']),
  check('quality').optional().isInt({ min: 0, max: 100 }).toInt(),
];

// Build file paths based on image parameters
const buildPaths = (
  imageName: string,
  format: string,
  width: number,
  height: number,
  imageQuality: number,
): {
  originalImagePath: string;
  outputFileName: string;
  outputFilePath: string;
} => {
  const originalImagePath: string = path.join(
    __dirname,
    '..',
    imageConfig.originalPath,
    `${imageName}.${format || imageConfig.defaultFormat}`,
  );

  const outputFileName: string = `thumbnail_${imageName}_${imageQuality}_${width}_${height}.${
    format || imageConfig.defaultFormat
  }`;
  const outputFilePath: string = path.join(
    __dirname,
    '..',
    imageConfig.thumbnailPath,
    outputFileName,
  );

  return { originalImagePath, outputFileName, outputFilePath };
};

// Send a cached image response
const sendCachedImage = (
  res: Response,
  _format: string,
  cachedImagePath: string,
): void => {
  logger.info(`Image found in cache: ${cachedImagePath}`);
  res.type('image/jpeg');
  res.sendFile(cachedImagePath);
};

// Send a processed image response
const sendProcessedImage = async (
  res: Response,
  imageName: string,
  outputFilePath: string,
): Promise<void> => {
  logger.info(`Image processed: ${imageName}`);
  res.sendFile(outputFilePath);
};

// Handle validation errors
const handleErrors = (
  res: Response,
  errors: Result<ValidationError>,
): Response => {
  return res.status(400).json({ errors: errors.array() });
};
// Controller to process and serve images
export const processImage = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  try {
    // Validate image parameters
    const validationRules = validateImageParameters();
    await Promise.all(validationRules.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleErrors(res, errors);
    }

    const { width, height, imageName, format, quality } = req.query as {
      width?: string;
      height?: string;
      imageName?: string;
      format?: string;
      quality?: string;
    };

    // Ensure values are strings or default to empty string
    const safeWidth: string = width || '300';
    const safeHeight: string = height || '300';
    const safeImageName: string = imageName || '';
    const safeFormat: string = format || imageConfig.defaultFormat;
    const safeQuality: string = quality || `${imageConfig.defaultQuality}`;

    logger.info(`Image processing request received: ${safeImageName}`);

    const imageFormat = safeFormat as ImageFormat;
    const imageQuality =
      parseInt(safeQuality, 10) || imageConfig.defaultQuality;

    const { originalImagePath, outputFileName, outputFilePath } = buildPaths(
      safeImageName,
      safeFormat,
      parseInt(safeWidth, 10),
      parseInt(safeHeight, 10),
      imageQuality,
    );

    const cachedImagePath = getFromCache(outputFileName);

    if (cachedImagePath) {
      sendCachedImage(res, safeFormat, cachedImagePath);
    } else {
      const originalImageExists = await fs
        .access(originalImagePath)
        .then(() => true)
        .catch(() => false);

      if (!originalImageExists) {
        return res.status(404).json({ error: 'Image not found' });
      }

      const processingOptions = {
        width: parseInt(safeWidth, 10),
        height: parseInt(safeHeight, 10),
      };

      const processedImageBuffer = await resizeImage(
        originalImagePath,
        processingOptions,
        imageFormat,
        imageQuality,
      );

      await fs.writeFile(outputFilePath, processedImageBuffer);

      addToCache(outputFileName, outputFilePath);

      sendProcessedImage(res, safeImageName, outputFilePath);
    }
  } catch (error) {
    logger.error('Image processing and saving error:', error);
    res.status(500).json({ error: 'Image processing and saving error' });
  }
};
