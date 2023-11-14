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
    
    throw new Error(`Image List error: ${(error as Error).message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
