// configures the Express application. It defines the middleware, routes, and other configurations.
// src/app.ts
import express from 'express';
import multer from 'multer';
import imageRoutes from './routes/imageRoutes';

const app = express();

// Multer Configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// // Use 'upload' middleware to handle file uploads
// app.use(upload.single('file')); // 'file' is the field name in the form

// Middleware
app.use(express.json());

// API Routes
app.use('/api/images', imageRoutes);

export default app;
