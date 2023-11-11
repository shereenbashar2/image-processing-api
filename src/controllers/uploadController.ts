import multer from 'multer';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder for storing original files
    cb(null, 'assets/original/');
  },
  filename: function (req, file, cb) {
    // Generate a filename using a timestamp and the original filename
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

// Create a multer instance with the configured storage
export const upload = multer({ storage: storage });
