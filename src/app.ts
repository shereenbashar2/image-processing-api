import express from 'express';
import path from 'path'; // for working with file paths
import imageRoutes from './routes/imageRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();

// Middleware to serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());



app.use('/api/images', uploadRoutes); // Pass the 'upload' middleware to the routes

app.use('/api/images', imageRoutes);
export default app;
