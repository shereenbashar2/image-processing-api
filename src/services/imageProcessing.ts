import sharp from 'sharp';

/**
 * Image formats supported by the resizeImage function.
 */
export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  JPG = 'jpg',
}

/**
 * Resize an image using the Sharp library.
 * @param {string} inputFilePath - The file path of the input image.
 * @param {{ width: number; height: number }} options - The resizing options (width and height).
 * @param {ImageFormat} [format=ImageFormat.JPG] - The desired output format (JPEG, PNG, JPG).
 * @param {number} quality - The image quality (e.g., 80).
 * @returns {Promise<Buffer>} A Promise that resolves to the processed image buffer.
 * @throws {Error} If there is an error during image processing.
 */
export const resizeImage = async (
  inputFilePath: string,
  options: { width: number; height: number },
  format: ImageFormat = ImageFormat.JPG,
  quality: number,
): Promise<Buffer> => {
  try {
    // console.log('inputFilePath :', inputFilePath);
    // Validate the quality parameter
    if (quality < 0 || quality > 100) {
      throw new Error('Invalid quality value. Should be between 0 and 100.');
    }

    const processedImageBuffer = await sharp(inputFilePath)
      .resize({
        width: options.width,
        height: options.height,
      })
      .toFormat(format, { quality }) // Convert the format to lowercase
      .toBuffer();

    return processedImageBuffer;
  } catch (error) {
    throw new Error(`Image processing error: ${(error as Error).message}`);
  }
};
