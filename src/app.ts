import express from 'express';
import multer from 'multer';
import path from 'path'; // for working with file paths
import imageRoutes from './routes/imageRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();



// Middleware
app.use(express.json());



app.use('/api/images', uploadRoutes); // Pass the 'upload' middleware to the routes

app.use('/api/images', imageRoutes);
export default app;
