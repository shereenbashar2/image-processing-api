import sharp from 'sharp';

/**
 * Resize an image using the Sharp library and return the processed image as a buffer.
 * @param inputFilePath - The path to the input image file.
 * @param options - The resizing options, including width and height.
 * @returns A Promise that resolves with the processed image buffer.
 */
export const resizeImage = async (inputFilePath: string, options: { width: number; height: number }): Promise<Buffer> => {
  try {
    const processedImageBuffer = await sharp(inputFilePath)
      .resize({
        width: options.width,
        height: options.height,
      })
      .toBuffer();

    return processedImageBuffer;
  } catch (error) {
        throw new Error(`Image processing error: ${(error as Error).message}`); 

  }
};

export default resizeImage;
