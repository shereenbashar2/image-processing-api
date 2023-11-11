import { Request, Response } from 'express';
import * as imageService from '../services/imageService';

// Controller to get thumbnail images
export const getThumbnailImages = async (req: Request, res: Response) => {
  try {
    // Fetch thumbnail images from the service
    const thumbnailImages = await imageService.getImageList();
    
    // Send the thumbnail images as a JSON response
    res.json(thumbnailImages);
  } catch (error) {
    // Log the error for debugging purposes
    console.error(
      'Error in thumbnailController.getThumbnailImages:',
      (error as Error).message,
    );
    
    // Return a 500 Internal Server Error response with a generic error message
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
