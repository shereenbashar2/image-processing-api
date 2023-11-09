// src/controllers/imageController.ts
import { Request, Response } from 'express';
import path from 'path';
import { resizeImage, ImageFormat } from '../services/imageProcessing'; // Import the imageProcessing utility
import { getFromCache, addToCache } from '../services/ImageCache'; // Import cache functions
import fs from 'fs/promises'; // Import the fs module for file operations

export const processImage = async (req: Request, res: Response) => {
  try {
    // Read processing options and imageName from query parameters
    const { width, height, imageName, format , quality} = req.query;
    // Ensure that the 'format' parameter is of type ImageFormat or default to JPEG
    const imageFormat: ImageFormat =
      (format as ImageFormat) || ImageFormat.JPEG;
     const imageQuality = parseInt(quality as string, 10) || 80; // Default quality is 80

    const processingOptions = {
      width: parseInt(width as string, 10) || 300, // Default to 300 if not specified
      height: parseInt(height as string, 10) || 300, // Default to 300 if not specified
   
    };

    // Ensure that imageName is a string
    if (typeof imageName === 'string') {
      // Append the extension (e.g., ".jpg") to imageName
      // const imageNameWithExtension = imageName + '.jpg'; // Adjust the extension as needed
      const imageNameWithExtension = `${imageName}.${format || 'jpg'}`;

      // Generate a unique cache key based on processing options and image name
      const cacheKey = `${imageName}_${imageQuality}_${processingOptions.width}_${processingOptions.height}_${format || 'jpg'}`;

      // Check if the processed image is cached in memory
      const cachedImagePath = getFromCache(cacheKey);

      if (cachedImagePath) {
        res.type(`image/${format || 'jpg'}`); // Use 'jpeg' as default format
        return res.sendFile(cachedImagePath); // Send the cached image as a response
      }

      // Define the path to the original image in the assets folder
      const assetsDirectory = '../assets/original'; // Change to your assets directory name
      const originalImagePath = path.join(
        __dirname,
        '..',
        assetsDirectory,
        imageNameWithExtension,
      );

      // Check if the original image exists
      const originalImageExists = await fs
        .access(originalImagePath)
        .then(() => true)
        .catch(() => false);

      if (!originalImageExists) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Use the resizeImage function to process the image and get a buffer
      const processedImageBuffer = await resizeImage(
        originalImagePath,
        processingOptions,
        imageFormat,
        imageQuality
      );

      // Define the file path to save the processed image
      const outputDirectory = '../assets/thumbnail'; // Change to your directory name
      const outputFileName = `thumbnail_${imageName}_${imageQuality}_${processingOptions.width}_${processingOptions.height}.${format || 'jpg'}`; // Unique file name

      const outputFilePath = path.join(
        __dirname,
        '..',
        outputDirectory,
        outputFileName,
      );

      // Write the buffer to a file
      await fs.writeFile(outputFilePath, processedImageBuffer);

      // Cache the file path for future access
      addToCache(cacheKey, outputFilePath);

      // Send the processed image file as a response
      res.sendFile(outputFilePath);
    } else {
      return res.status(400).json({ error: 'Invalid image name' });
    }
  } catch (error) {
    console.error('Image processing and saving error:', error);
    res.status(500).json({ error: 'Image processing and saving error' });
  }
};
