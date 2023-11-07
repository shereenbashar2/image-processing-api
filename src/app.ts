// import express from 'express';
// // import cors from 'cors';
// import imageRoutes from './routes/imageRoutes';
// import errorMiddleware from './middleware/errorMiddleware';

// const app = express();
// const port = process.env.PORT || 3000;

// // app.use(cors());
// app.use(express.json());

// // API Routes
// app.use('/api/images', imageRoutes);

// // Error handling middleware
// app.use(errorMiddleware);

// export default app;

import express from 'express';
import imageRoutes from './routes/imageRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API Routes
app.use('/api/images', imageRoutes);

export default app;

