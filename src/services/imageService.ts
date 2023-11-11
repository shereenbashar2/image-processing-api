// services/imageService.ts

import { promises as fsPromises } from 'fs';
import path from 'path';

const thumbnailFolderPath = path.join(__dirname, '../../assets/thumbnail');

export const getImageList = async () => {
  try {
    const thumbnailFiles = await fsPromises.readdir(thumbnailFolderPath);
    const thumbnailImages = thumbnailFiles.map((filename) => ({
      filename,
      url: `/assets/thumbnail/${filename}`,
    }));
    return thumbnailImages;
  } catch (error) {
    console.error('Error fetching thumbnail images:', (error as Error).message);
    throw error;
  }
};
