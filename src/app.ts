import express from 'express';
import path from 'path';
import imageRoutes from './routes/imageRoutes';
import uploadRoutes from './routes/uploadRoutes';
import * as thumbnailController from './controllers/thumbnailController';
/**
 * Express application setup.
 * @module app
 * @exports {Express} app - The configured Express application instance.
 */
const app = express();

// Middleware to serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON in requests
app.use(express.json());

// Serve static assets for the 'thumbnail' route
const staticAssetsPath = path.resolve(__dirname, '..', 'assets');
app.use('/assets/thumbnail', (req, res, next) => {
  express.static(path.resolve(staticAssetsPath, 'thumbnail'))(req, res, next);
});

/**
 * Route to get thumbnail images.
 * @name GET/api/images/thumbnails
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
app.get('/api/images/thumbnails', (req, res) => {
  try {
    thumbnailController.getThumbnailImages(req, res);
  } catch (error) {
    console.error('Error in thumbnail route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Define routes
app.use('/api/images', uploadRoutes);
app.use('/api/images', imageRoutes);

export default app;
