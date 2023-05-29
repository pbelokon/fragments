const request = require('supertest');
const app = require('../../src/app');

// if any request for resource can't be found, it should return 404 and error body
describe('404 handler', () => {
  test('should return 404 response', async () => {
    const res = await request(app).get('/unkown-resource');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
