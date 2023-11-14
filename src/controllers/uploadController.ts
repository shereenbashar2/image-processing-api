import multer, { StorageEngine } from 'multer';
import { Request } from 'express';

// Multer storage configuration
const storage: StorageEngine = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    // Specify the destination folder for storing original files
    cb(null, 'assets/original/');
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    // Generate a filename using a timestamp and the original filename
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

// Create a multer instance with the configured storage
export const upload = multer({ storage });
