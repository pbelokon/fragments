const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('fragment')
      .set('content-type', 'text/plain');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment != null).toBe(true);
  });

  test('response with unknown Content-Type should return 415', async () => {
    const data = 'This is a fragment';

    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'not/type')
      .send(data)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(415);
  });

  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('fragment')
      .set('content-type', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment != null).toBe(true);
  });

  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('fragment')
      .set('content-type', 'text/markdown');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment != null).toBe(true);
  });

  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send('fragment')
      .set('content-type', 'text/html');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment != null).toBe(true);
  });
});
