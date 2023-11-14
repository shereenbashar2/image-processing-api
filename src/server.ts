import app from './app';

/**
 * Entry point for starting the Express server.
 * @module server
 * @exports {Server} server - The Express server instance.
 */

const port = process.env.PORT || 3000;

/**
 * The Express server instance.
 * @type {Server}
 */
const server = app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
});

export default server;
