import { Request, Response } from 'express';
import path from 'path';
import { validationResult, check } from 'express-validator';
import fs from 'fs/promises';
import logger from '../utils/logger';
import { resizeImage, ImageFormat } from '../services/imageProcessing';
import { getFromCache, addToCache } from '../services/ImageCache';

const imageConfig = {
  originalPath: '../assets/original',
  thumbnailPath: '../assets/thumbnail',
  defaultFormat: 'jpg',
  defaultQuality: 80,
};

const validateImageParameters = () => [
  check('width').optional().isInt({ min: 50, max: 300 }).toInt(),
  check('height').optional().isInt({ min: 50, max: 300 }).toInt(),
  check('imageName').notEmpty(),
  check('format').optional().isIn(['jpg', 'jpeg', 'png']),
  check('quality').optional().isInt({ min: 0, max: 100 }).toInt(),
];

export const processImage = async (req: Request, res: Response) => {
  try {
    const validationRules = validateImageParameters();
    await Promise.all(validationRules.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { width, height, imageName, format, quality } = req.query;

    logger.info(`Image processing request received: ${imageName}`);

    const imageFormat = (format as ImageFormat) || ImageFormat.JPEG;
    const imageQuality =
      parseInt(quality as string, 10) || imageConfig.defaultQuality;

    const originalImagePath = path.join(
      __dirname,
      '..',
      imageConfig.originalPath,
      `${imageName}.${format || imageConfig.defaultFormat}`,
    );

    const outputFileName = `thumbnail_${imageName}_${imageQuality}_${
      width || 300
    }_${height || 300}.${format || imageConfig.defaultFormat}`;
    const outputFilePath = path.join(
      __dirname,
      '..',
      imageConfig.thumbnailPath,
      outputFileName,
    );

    const cachedImagePath = getFromCache(outputFileName);

    if (cachedImagePath) {
      logger.info(`Image found in cache: ${imageName}`);
      res.type(`image/${format || 'jpg'}`);
      return res.sendFile(cachedImagePath);
    }

    const originalImageExists = await fs
      .access(originalImagePath)
      .then(() => true)
      .catch(() => false);

    if (!originalImageExists) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const processingOptions = {
      width: parseInt(width as string, 10) || 300,
      height: parseInt(height as string, 10) || 300,
    };

    const processedImageBuffer = await resizeImage(
      originalImagePath,
      processingOptions,
      imageFormat,
      imageQuality,
    );

    logger.info(`Image processed: ${imageName}`);

    await fs.writeFile(outputFilePath, processedImageBuffer);

    addToCache(outputFileName, outputFilePath);

    res.sendFile(outputFilePath);
  } catch (error) {
    logger.error('Image processing and saving error:', error);
    res.status(500).json({ error: 'Image processing and saving error' });
  }
};
