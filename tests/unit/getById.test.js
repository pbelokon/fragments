const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/incorrect').expect(401));

  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/incorrect')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('fragment id not found should return status: 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/incorrect')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
  });

  test('request with existent fragment ID should return fragment with data', async () => {
    const user = { email: 'user1@email.com', password: 'password1' };
    const data = 'this is some fragment data.';
    const contentType = 'text/plain; charset=utf-8';
    const contentLength = data.length;

    const { fragment } = (
      await request(app)
        .post('/v1/fragments')
        .send(data)
        .set('Content-Type', contentType)
        .auth(user.email, user.password)
    ).body;

    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .buffer()
      .auth(user.email, user.password);

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe(contentType);
    expect(Number.parseInt(res.header['content-length'])).toBe(contentLength);
    expect(Buffer.from(res.text)).toEqual(Buffer.from(data));
  });

  test('unknown extension should return status 415', async () => {
    const user = { email: 'user1@email.com', password: 'password1' };

    const { fragment } = (
      await request(app)
        .post('/v1/fragments')
        .send(Buffer.from('this is some text'))
        .set('Content-Type', 'text/plain; charset=utf-8')
        .auth(user.email, user.password)
    ).body;

    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}.not-an-extension`)
      .auth(user.email, user.password);

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
    expect(res.body.error.code).toBe(415);
  });

  test('request with existent fragment ID and extension should return fragment with data', async () => {
    const user = { email: 'user1@email.com', password: 'password1' };
    const data = 'this is some fragment data.';
    const contentType = 'text/plain';
    const contentLength = data.length;

    const { fragment } = (
      await request(app)
        .post('/v1/fragments')
        .send(data)
        .set('Content-Type', contentType)
        .auth('user1@email.com', 'password1')
    ).body;

    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}.txt`)
      .buffer()
      .auth(user.email, user.password);

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe(contentType);
    expect(Number.parseInt(res.header['content-length'])).toBe(contentLength);
    expect(Buffer.from(res.text)).toEqual(Buffer.from(data));
  });

  test('request markdown fragment with not .ext return fragment with data', async () => {
    const user = { email: 'user1@email.com', password: 'password1' };
    const data = 'this is some fragment data.';
    const contentType = 'text/markdown';
    const contentLength = data.length;

    const { fragment } = (
      await request(app)
        .post('/v1/fragments')
        .send(data)
        .set('Content-Type', contentType)
        .auth(user.email, user.password)
    ).body;

    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .buffer()
      .auth(user.email, user.password);

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe(contentType);
    expect(Number.parseInt(res.header['content-length'])).toBe(contentLength);
    expect(Buffer.from(res.text)).toEqual(Buffer.from(data));
  });

  test('request with existent fragment ID and extension should return fragment with data', async () => {
    const user = {
      email: 'user1@email.com',
      password: 'password1',
    };
    const markdownData = '# Heading\n\nThis is some *Markdown* content.';
    const htmlData = '<h1>Heading</h1>\n<p>This is some <em>Markdown</em> content.</p>';
    const contentType = 'text/html; charset=utf-8';

    const { fragment } = (
      await request(app)
        .post('/v1/fragments')
        .send(markdownData)
        .set('Content-Type', 'text/markdown')
        .auth(user.email, user.password)
        .expect(201)
    ).body;
    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}.html`)
      .buffer()
      .auth(user.email, user.password);

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toBe(contentType);
    expect(res.text.trim()).toBe(htmlData.trim());
  });
});
