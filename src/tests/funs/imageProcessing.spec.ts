import app from '../../app';
import { ImageFormat, resizeImage } from '../../services/imageProcessing';
import * as path from 'path';

// Create a server instance for testing
const server = app.listen(0); // Use 0 to automatically assign an available port

describe('Image Processing Service', () => {
  it('should not throw an error during image resizing', async () => {
    const imagePath = path.resolve(
      __dirname,
      '../../../assets/original/encenadaport.jpg',
    );
    const processingOptions = { width: 100, height: 100 };

    const imageQuality = 80;

    expect(async () => {
      await resizeImage(
        imagePath,
        processingOptions,
        ImageFormat.JPG,
        imageQuality,
      );
    }).not.toThrow();
  });
  it('should resize a JPEG image successfully', async () => {
    const imagePath = path.resolve(
      __dirname,
      '../../../assets/original/food1.jpeg',
    );

    const processingOptions = { width: 100, height: 100 };
    const imageQuality = 80;
    const resizedImageBuffer = await resizeImage(
      imagePath,
      processingOptions,
      ImageFormat.JPEG,
      imageQuality,
    );
    // Add assertions to check the dimensions or properties of the resized image buffer
    expect(resizedImageBuffer.length).toBeGreaterThan(0);
  });

  it('should resize a PNG image successfully', async () => {
    const imagePath = path.resolve(
      __dirname,
      '../../../assets/original/food.png',
    );
    const processingOptions = { width: 200, height: 200 };

    const imageQuality = 90;

    const resizedImageBuffer = await resizeImage(
      imagePath,
      processingOptions,
      ImageFormat.PNG,
      imageQuality,
    );

    // Add assertions to check the dimensions or properties of the resized image buffer
    expect(resizedImageBuffer.length).toBeGreaterThan(0);
  });
});

afterAll(() => {
  server.close(); // Close the server after all tests are done
});
