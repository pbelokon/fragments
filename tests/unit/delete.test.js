const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  test('authenticated users deletes a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    let id = JSON.parse(postRes.text).fragment.id;
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(200);
  });
});
