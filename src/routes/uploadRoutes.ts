import { Router, Request, Response } from 'express';
import { upload } from '../controllers/uploadController';

const router = Router();

// Define a route to handle file upload
router.post(
  '/upload',
  upload.single('file'),
  (req: Request, res: Response): Response => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    return res.status(200).json({
      message: 'File uploaded and saved successfully',
      file: req.file,
    });
  },
);

export default router;
