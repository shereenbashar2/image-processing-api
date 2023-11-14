import { promises as fsPromises } from 'fs';
import path from 'path';

/**
 * Fetches a list of thumbnail images.
 * @returns {Promise<Array<{ filename: string; url: string }>>} A Promise that resolves to an array of thumbnail images.
 * @throws {Error} If there is an error while fetching the thumbnail images.
 */
export const getImageList = async (): Promise<Array<{ filename: string; url: string; }>> => {
  const thumbnailFolderPath = path.join(__dirname, '../../assets/thumbnail');

  try {
    const thumbnailFiles = await fsPromises.readdir(thumbnailFolderPath);

    const thumbnailImages = thumbnailFiles.map((filename) => ({
      filename,
      url: `/assets/thumbnail/${filename}`,
    }));

    return thumbnailImages;
  } catch (error) {
    throw new Error(
      'Unable to fetch thumbnail images. Please try again later.',
    );
  }
};
