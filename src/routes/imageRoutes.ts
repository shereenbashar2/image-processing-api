import express from 'express';
import { processImage } from '../controllers/imageController';

const router = express.Router();

// Image processing route
router.post('/process', processImage);

export default router;
