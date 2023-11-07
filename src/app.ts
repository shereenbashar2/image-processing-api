import express from 'express';

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // JSON body parser middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser middleware

// Your middleware configurations and route setups can go here

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
