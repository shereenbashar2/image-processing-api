// entry point for starting your Express server. It imports the Express application created in app.ts and starts the server on the specified port.
import app from './app';

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
