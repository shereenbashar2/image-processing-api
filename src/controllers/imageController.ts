// src/controllers/imageController.ts
import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { resizeImage } from '../services/imageProcessor'; // Import the imageProcessing utility
import { getFromCache, addToCache } from '../services/ImageCache'; // Import cache functions


export const processImage = async (req: Request, res: Response) => {
  try {
    // Read processing options from query parameters
    const { width, height, imageName } = req.query;
    const processingOptions = {
      width: parseInt(width as string, 10) || 300, // Default to 300 if not specified
      height: parseInt(height as string, 10) || 300, // Default to 300 if not specified
    };

    // Ensure that imageName is a string
    if (typeof imageName === 'string') {
      // Generate a unique cache key based on processing options and image name
      const cacheKey = `${imageName}_${processingOptions.width}_${processingOptions.height}`;

      // Check if the processed image is cached in memory
      const cachedImagePath = getFromCache(cacheKey);

      if (cachedImagePath) {
        // Send the cached image as a response
        return res.sendFile(cachedImagePath);
      }

      // Define the path to the original image in the assets folder
      const assetsDirectory = '../assets/original'; // Change to your assets directory name
      const originalImagePath = path.join(__dirname, '..', assetsDirectory, `${imageName}.jpg`);


      // Check if the original image exists
      const originalImageExists = await fs.access(originalImagePath).then(() => true).catch(() => false);

      if (!originalImageExists) {
        return res.status(404).json({ error: 'Image not found: ' +originalImagePath});
      }

      // Define the file path to save the processed image
      const outputDirectory = '../assets/thumbnail'; // Change to your directory name
      const outputFileName = `thumbnail_${imageName}_${processingOptions.width}_${processingOptions.height}.jpg`; // Unique file name

      const outputFilePath = path.join(__dirname, '..', outputDirectory, outputFileName);

      // Check if the processed image exists on disk
      const fileExists = await fs.access(outputFilePath).then(() => true).catch(() => false);

      if (!fileExists) {
        // The processed image doesn't exist on disk, so we need to process and save it
        const imageBuffer = await resizeImage(originalImagePath, processingOptions,outputFilePath);

        // Save the processed image to disk
        await fs.writeFile(outputFilePath, imageBuffer);

        // Cache the file path for future access
        addToCache(cacheKey, outputFilePath);
      }

      // Send the processed image from disk as a response
      res.sendFile(outputFilePath);
    } else {
      return res.status(400).json({ error: 'Invalid image name' });
    }
  } catch (error) {
    console.error('Image processing and saving error:', error);
    res.status(500).json({ error: 'Image processing and saving error' });
  }
};
