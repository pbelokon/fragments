const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('authenticated users get a fragments array', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('fragment')
      .set('content-type', 'text/plain');

    let id = JSON.parse(postRes.text).fragment.id;

    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send('fragment 2')
      .set('content-Type', 'text/plain');

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.status).toBe('ok');
  });

  test('unauthenticated users updates fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('fragment')
      .set('content-type', 'text/plain');

    let id = JSON.parse(postRes.text).fragment.id;

    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .send('fragment 2')
      .set('content-Type', 'text/plain');

    expect(putRes.statusCode).toBe(401);
  });

  test('authenticated users tries to update fragment with different type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('fragment')
      .set('content-type', 'text/plain');

    let id = JSON.parse(postRes.text).fragment.id;

    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send('fragment 2')
      .set('content-Type', 'text/json');

    expect(putRes.statusCode).toBe(415);
  });
});
