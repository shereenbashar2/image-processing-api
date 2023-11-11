import sharp from 'sharp';

export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  JPG = 'jpg',
  // You can add more supported formats here
}

export const resizeImage = async (
  inputFilePath: string,
  options: { width: number; height: number },
  format: ImageFormat = ImageFormat.JPG, // Specify the format as an ImageFormat with a default value
  quality: number, // Image quality (e.g., 80)
): Promise<Buffer> => {
  try {
    const processedImageBuffer = await sharp(inputFilePath)
      .resize({
        width: options.width,
        height: options.height,
      })
      .toFormat(format, { quality })
      .toBuffer();

    return processedImageBuffer;
  } catch (error) {
    throw new Error(`Image processing error: ${(error as Error).message}`);
  }
};

export default resizeImage;
