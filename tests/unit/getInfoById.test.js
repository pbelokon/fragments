const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('request with existing ID should return fragment information', async () => {
    const user = { email: 'user1@email.com', password: 'password1' };
    const data = 'this is some fragment data.';
    const contentType = 'text/plain; charset=utf-8';

    const { fragment } = (
      await request(app)
        .post('/v1/fragments')
        .send(data)
        .set('Content-Type', contentType)
        .auth(user.email, user.password)
    ).body;

    const id = fragment.id;
    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .buffer()
      .auth(user.email, user.password);

    expect(res.statusCode).toBe(200);
  });
});
