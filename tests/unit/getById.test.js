const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('fragment id not found should return status: 404', async () => {
    const res = await request(app).get('/v1/fragments/sus').auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
  });
});
