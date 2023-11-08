import sharp from 'sharp';

export interface ImageProcessingOptions {
  width: number;
  height: number;
}

// Resize an image using Sharp
export const resizeImage = async (
  imagePath: string,
  options: ImageProcessingOptions,
  outputPath: string,
) => {
  try {
    const { width, height } = options;
    await sharp(imagePath).resize(width, height).toFile(outputPath);

    return outputPath; // Return the file path where the image is saved
  } catch (error: any) {
    throw new Error(
      'Image processing error: ' + (error.message || 'Unknown error'),
    );
  }
};
