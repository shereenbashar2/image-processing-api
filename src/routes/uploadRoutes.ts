import express from 'express';
import { Router } from 'express';
import { upload } from '../controllers/uploadController';

const router = Router();

// Define a route to handle file upload
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res
    .status(200)
    .json({ message: 'File uploaded and saved successfully', file: req.file });
});

export default router;
