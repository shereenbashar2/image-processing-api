import express from 'express';
import path from 'path'; // for working with file paths
import imageRoutes from './routes/imageRoutes';
import uploadRoutes from './routes/uploadRoutes';
import * as thumbnailController from './controllers/thumbnailController';

const app = express();

// Middleware to serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

// Serve static assets
// const staticAssetsPath = path.join(__dirname, '..', 'assets/thumbnail');

const staticAssetsPath = path.resolve(__dirname, '..', 'assets');

const staticDir = path.join(__dirname, 'public');
console.log('staticDir', staticDir);
app.use(express.static(path.resolve(staticAssetsPath, 'thumbnail')));
//   app.use(express.static(path.resolve(staticAssetsPath, 'thumbnail')));

app.use('/assets/thumbnail', (req, res, next) => {
  // res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  express.static(path.resolve(staticAssetsPath, 'thumbnail'))(req, res, next);
});

// Define routes
app.get('/api/images/thumbnails', (req, res) => {
  try {
    thumbnailController.getThumbnailImages(req, res);
  } catch (error) {
    console.error('Error in thumbnail route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/api/images', uploadRoutes);

app.use('/api/images', imageRoutes);
export default app;
