// controllers/thumbnailController.ts

import { Request, Response } from 'express';
import * as imageService from '../services/imageService';

export const getThumbnailImages = async (req: Request, res: Response) => {
  try {
    const thumbnailImages = await imageService.getImageList();
    res.json(thumbnailImages);
  } catch (error) {
    console.error(
      'Error in thumbnailController.getThumbnailImages:',
      (error as Error).message,
    );
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
