import request from 'supertest';
import app from '../../app'; 

// Create a server instance for testing
const server = app.listen(0); // Use 0 to automatically assign an available port

// Test for Invalid Processing Options
it('should return a 400 error for invalid processing options', async () => {
  // Define a query with invalid processing options, e.g., negative width and height
  const invalidQuery = {
    width: -100,
    height: -100,
    imageName: 'encenadaport',
    format: 'jpg',
    quality: 80,
  };

  const response = await request(app)
    .get('/api/images/process-image')
    .query(invalidQuery);

  expect(response.status).toBe(400);
});

// Test for Missing Query Parameters
it('should return a 400 error for missing query parameters', async () => {
  const response = await request(app).get('/api/images/process-image');

  expect(response.status).toBe(400);
});
// Test for Invalid Image Format
it('should return a 400 error for an invalid image format', async () => {
  // Provide an unsupported image format
  const invalidQuery = {
    width: 200,
    height: 200,
    imageName: 'encenadaport',
    format: 'invalidformat', // Use an unsupported format
    quality: 80,
  };

  const response = await request(app)
    .get('/api/images/process-image')
    .query(invalidQuery);

  expect(response.status).toBe(400);
});
// Test for Quality Range Validation
it('should return a 400 error for an invalid quality value', async () => {
  // Provide an out-of-range quality value
  const invalidQuery = {
    width: 200,
    height: 200,
    imageName: 'encenadaport',
    format: 'jpg',
    quality: 120, // Use an invalid quality value
  };

  const response = await request(app)
    .get('/api/images/process-image')
    .query(invalidQuery);

  expect(response.status).toBe(400);
});

it('should return a 200 status and image/jpeg content type for a valid request', async () => {
  const response = await request(app)
    .get('/api/images/process-image')
    .query({
      width: 200,
      height: 200,
      imageName: 'encenadaport',
      format: 'jpg',
      quality: 80,
    });

  expect(response.status).toBe(200);
  expect(response.type).toBe('image/jpeg');
});
// Test for a Successful Request:
it('should return a processed image for a valid request', async () => {
  // Define a valid query with appropriate parameters
  const validQuery = {
    width: 200,
    height: 200,
    imageName: 'encenadaport', // Provide an existing image name
    format: 'jpg', // Adjust the format as needed
    quality: 80, // Adjust the image quality as needed
  };

  // Send a GET request to the API endpoint with the valid query
  const response = await request(app)
    .get('/api/images/process-image') // Use .get() for a GET request
    .query(validQuery);

  // Perform assertions on the response
  expect(response.status).toBe(200);
  expect(response.type).toBe('image/jpeg'); // Adjust the content type based on your format
});

// Test for an Invalid Image Name:
it('should return a 404 error for an invalid image name', async () => {
  // Define an invalid query with a nonexistent image name
  const invalidQuery = {
    width: 200,
    height: 200,
    imageName: 'nonexistentimage', // Provide a non-existent image name
    format: 'jpeg', // Adjust the format as needed
    quality: 80, // Adjust the image quality as needed
  };

  // Send a GET request to the API endpoint with the invalid query
  const response = await request(app)
    .get('/api/images/process-image') // Use .get() for a GET request
    .query(invalidQuery);

  // Perform assertions on the response
  expect(response.status).toBe(404);
});

afterAll(() => {
  server.close(); // Close the server after all tests are done
});
